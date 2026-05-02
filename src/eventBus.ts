import { EventEmitter } from 'events';

/**
 * EventBus
 *
 * Lightweight event-based communication channel for local microservice simulation.
 */
export class EventBus extends EventEmitter {
  constructor() {
    super();
  }
}
