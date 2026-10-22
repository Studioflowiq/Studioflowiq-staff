import ExpoModulesCore
import Foundation
import Network

public final class AV8ReceiverModule: Module {
  private var listener: NWListener?
  private var connections: [NWConnection] = []
  private var session = 0
  public func definition() -> ModuleDefinition {
    Name("AV8Receiver")
    Events("onPacket")
    AsyncFunction("start") { (generation: Int) in
      self.stopReceiver()
      self.session = generation
      let parameters = NWParameters.udp
      parameters.requiredInterfaceType = .wifi
      let listener = try NWListener(using: parameters, on: 4000)
      self.listener = listener
      listener.stateUpdateHandler = { [weak self, weak listener] state in
        guard let self = self, let listener = listener, self.listener === listener else { return }
        switch state {
        case .ready: self.report(["status": "Listening on Wi-Fi · UDP 4000"], generation: generation)
        case .failed(let error):
          self.report(["status": "Receiver unavailable: \(error.localizedDescription)"], generation: generation)
          self.stopReceiver()
        case .waiting(let error): self.report(["status": "Receiver waiting: \(error.localizedDescription)"], generation: generation)
        default: break
        }
      }
      listener.newConnectionHandler = { [weak self, weak listener] connection in
        guard let self = self, let listener = listener, self.listener === listener, self.connections.count < 8 else { connection.cancel(); return }
        self.connections.append(connection)
        connection.stateUpdateHandler = { [weak self, weak connection] state in
          guard let self = self, let connection = connection else { return }
          switch state {
          case .failed, .cancelled: self.connections.removeAll { $0 === connection }
          default: break
          }
        }
        connection.start(queue: .main)
        self.receive(connection, listener: listener, generation: generation)
      }
      listener.start(queue: .main)
    }.runOnQueue(.main)
    AsyncFunction("stop") { self.stopReceiver() }.runOnQueue(.main)
    OnAppEntersBackground { self.stopReceiver() }
    OnDestroy { self.stopReceiver() }
  }
  private func report(_ data: [String: Any], generation: Int) {
    guard session == generation, listener != nil else { return }
    var event = data; event["generation"] = generation
    sendEvent("onPacket", event)
  }
  private func receive(_ connection: NWConnection, listener: NWListener, generation: Int) {
    connection.receiveMessage { [weak self, weak connection, weak listener] data, _, _, error in
      guard let self = self, let connection = connection, let listener = listener, self.session == generation, self.listener === listener else { return }
      if let data = data, !data.isEmpty, data.count <= 1500 {
        self.report(["base64": data.base64EncodedString(), "peer": String(describing: connection.endpoint)], generation: generation)
      }
      if error == nil { self.receive(connection, listener: listener, generation: generation) }
      else { connection.cancel(); self.connections.removeAll { $0 === connection } }
    }
  }
  private func stopReceiver() {
    session += 1
    listener?.cancel(); listener = nil
    let old = connections; connections.removeAll()
    old.forEach { $0.cancel() }
  }
}
