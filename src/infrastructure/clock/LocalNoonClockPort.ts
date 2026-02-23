/**
 * @file_intent Defines the `LocalNoonClockPort` interface.
 * @repo_architecture Infrastructure Layer - Ports. This file defines a port in the hexagonal architecture, specifying a contract for a time provider that is based on the local noon time.
 * @term_definition
 *   - `TimeProvider`: An interface that defines a contract for providing the current time.
 *   - `LocalNoonClockPort`: An interface that extends `TimeProvider`, indicating that it's a specific type of time provider.
 * @contract The `LocalNoonClockPort` interface inherits all the methods from `TimeProvider`. Any adapter implementing this port must provide an implementation for all methods defined in `TimeProvider`.
 * @ai_instruction This is an interface definition. You should not modify this file unless you are changing the contract for the `LocalNoonClockPort`. If you need to implement this port, create a new adapter class in the `infrastructure` layer that implements this interface.
 */
import { TimeProvider } from "@domain/helpers/TimeProvider";
export interface LocalNoonClockPort extends TimeProvider {}
