export const mav_commands: any = {
  WAYPOINT: 16, // Navigate to waypoint.
  LOITER_UNLIM: 17, // Loiter around this waypoint an unlimited amount of time
  LOITER_TURNS: 18, // Loiter around this waypoint for X turns
  LOITER_TIME: 19, // Loiter around this waypoint for X seconds
  RETURN_TO_LAUNCH: 20, // Return to launch location
  LAND: 21, // Land at location.
  TAKEOFF: 22, // Takeoff from ground / hand
  LAND_LOCAL: 23, // Land at local position (local frame only)
  TAKEOFF_LOCAL: 24, // Takeoff from local position (local frame only)
  // moving vehicle
  CONTINUE_AND_CHANGE_ALT: 30, // Continue on the current course and climb/descend to specified
  // altitude.  When the altitude is reached
  // continue to the next command (i.e., don't
  // proceed to the next command until the
  // desired altitude is reached.
  LOITER_TO_ALT: 31, // Begin loiter at the specified Latitude and Longitude.  If Lat:Lon:0,
  // then loiter at the current position.  Don't
  // consider the navigation command complete
  // (don't leave loiter) until the altitude has
  // been reached.  Additionally, if the Heading
  // Required parameter is non-zero the
  // aircraft will not leave the loiter until
  // heading toward the next waypoint.
  FOLLOW_REPOSITION: 33, // Reposition the MAV after a follow target command has been sent
  ROI: 80, // Sets the region of interest (ROI) for a sensor set or the vehicle
  // itself. This can then be used by the
  // vehicles control system to control the
  // vehicle attitude and the attitude of
  // various sensors such as cameras.
  PATHPLANNING: 81, // Control autonomous path planning on the MAV.
  SPLINE_WAYPOINT: 82, // Navigate to waypoint using a spline path.
  ALTITUDE_WAIT: 83, // Mission command to wait for an altitude or downwards vertical speed.
  // This is meant for high altitude balloon
  // launches, allowing the aircraft to be idle
  // until either an altitude is reached or a
  // negative vertical speed is reached
  // (indicating early balloon burst). The
  // wiggle time is how often to wiggle the
  // control surfaces to prevent them seizing
  // up.
  VTOL_TAKEOFF: 84, // Takeoff from ground using VTOL mode, and transition to forward flight
  // with specified heading.
  VTOL_LAND: 85, // Land using VTOL mode
  GUIDED_ENABLE: 92, // hand control over to an external controller
  DELAY: 93, // Delay the next navigation command a number of seconds or until a
  // specified time
  PAYLOAD_PLACE: 94, // Descend and place payload. Vehicle moves to specified location,
  // descends until it detects a hanging payload
  // has reached the ground, and then releases
  // the payload. If ground is not detected
  // before the reaching the maximum descent
  // value (param1), the command will complete
  // without releasing the payload.
  LAST: 95, // NOP - This command is only used to mark the upper limit of the
  // NAV/ACTION commands in the enumeration
  MAV_CMD_CONDITION_DELAY: 112, // Delay mission state machine.
  MAV_CMD_CONDITION_CHANGE_ALT: 113, // Ascend/descend at rate.  Delay mission state machine until desired
  // altitude reached.
  MAV_CMD_CONDITION_DISTANCE: 114, // Delay mission state machine until within desired distance of next NAV
  // point.
  MAV_CMD_CONDITION_YAW: 115, // Reach a certain target angle.
  MAV_CMD_CONDITION_LAST: 159, // NOP - This command is only used to mark the upper limit of the
  // CONDITION commands in the enumeration
  SET_MODE: 176, // Set system mode.
  JUMP: 177, // Jump to the desired command in the mission list.  Repeat this action
  // only the specified number of times
  CHANGE_SPEED: 178, // Change speed and/or throttle set points.
  SET_HOME: 179, // Changes the home location either to the current location or a
  // specified location.
  SET_PARAMETER: 180, // Set a system parameter.  Caution!  Use of this command requires
  // knowledge of the numeric enumeration value
  // of the parameter.
  SET_RELAY: 181, // Set a relay to a condition.
  REPEAT_RELAY: 182, // Cycle a relay on and off for a desired number of cycles with a desired
  // period.
  SET_SERVO: 183, // Set a servo to a desired PWM value.
  REPEAT_SERVO: 184, // Cycle a between its nominal setting and a desired PWM for a desired
  // number of cycles with a desired period.
  FLIGHTTERMINATION: 185, // Terminate flight immediately
  CHANGE_ALTITUDE: 186, // Change altitude set point.
  LAND_START: 189, // Mission command to perform a landing. This is used as a marker in a
  // mission to tell the autopilot where a
  // sequence of mission items that represents a
  // landing starts. It may also be sent via a
  // COMMAND_LONG to trigger a landing, in which
  // case the nearest (geographically) landing
  // sequence in the mission will be used. The
  // Latitude/Longitude is optional, and may be
  // set to 0 if not needed. If specified then
  // it will be used to help find the closest
  // landing sequence.
  RALLY_LAND: 190, // Mission command to perform a landing from a rally point.
  GO_AROUND: 191, // Mission command to safely abort an autonomous landing.
  REPOSITION: 192, // Reposition the vehicle to a specific WGS84 global position.
  PAUSE_CONTINUE: 193, // If in a GPS controlled position mode, hold the current position or
  // continue.
  SET_REVERSE: 194, // Set moving direction to forward or reverse.
  SET_ROI_LOCATION: 195, // Sets the region of interest (ROI) to a location. This can then be used
  // by the vehicles control system to control
  // the vehicle attitude and the attitude of
  // various sensors such as cameras.
  SET_ROI_WPNEXT_OFFSET: 196, // Sets the region of interest (ROI) to be toward next waypoint, with
  // optional pitch/roll/yaw offset. This can
  // then be used by the vehicles control system
  // to control the vehicle attitude and the
  // attitude of various sensors such as
  // cameras.
  SET_ROI_NONE: 197, // Cancels any previous ROI command returning the vehicle/sensors to
  // default flight characteristics. This can
  // then be used by the vehicles control system
  // to control the vehicle attitude and the
  // attitude of various sensors such as
  // cameras.
  SET_ROI_SYSID: 198, // Mount tracks system with specified system ID. Determination of target
  // vehicle position may be done with
  // GLOBAL_POSITION_INT or any other means.
  CONTROL_VIDEO: 200, // Control onboard camera system.
  SET_ROI: 201, // Sets the region of interest (ROI) for a sensor set or the vehicle
  // itself. This can then be used by the
  // vehicles control system to control the
  // vehicle attitude and the attitude of
  // various sensors such as cameras.
  DIGICAM_CONFIGURE: 202, // Configure digital camera. This is a fallback message for systems that
  // have not yet implemented PARAM_EXT_XXX
  // messages and camera definition files (see h
  // ttps://mavlink.io/en/services/camera_def.ht
  // ml ).
  DIGICAM_CONTROL: 203, // Control digital camera. This is a fallback message for systems that
  // have not yet implemented PARAM_EXT_XXX
  // messages and camera definition files (see h
  // ttps://mavlink.io/en/services/camera_def.ht
  // ml ).
  MOUNT_CONFIGURE: 204, // Mission command to configure a camera or antenna mount
  MOUNT_CONTROL: 205, // Mission command to control a camera or antenna mount
  SET_CAM_TRIGG_DIST: 206, // Mission command to set camera trigger distance for this flight. The
  // camera is triggered each time this distance
  // is exceeded. This command can also be used
  // to set the shutter integration time for the
  // camera.
  FENCE_ENABLE: 207, // Mission command to enable the geofence
  PARACHUTE: 208, // Mission command to trigger a parachute
  MOTOR_TEST: 209, // Mission command to perform motor test.
  INVERTED_FLIGHT: 210, // Change to/from inverted flight.
  GRIPPER: 211, // Mission command to operate EPM gripper.
  AUTOTUNE_ENABLE: 212, // Enable/disable autotune.
  SET_YAW_SPEED: 213, // Sets a desired vehicle turn angle and speed change.
  SET_CAM_TRIGG_INTERVAL: 214, // Mission command to set camera trigger interval for this flight. If
  // triggering is enabled, the camera is
  // triggered each time this interval expires.
  // This command can also be used to set the
  // shutter integration time for the camera.
  MOUNT_CONTROL_QUAT: 220, // Mission command to control a camera or antenna mount, using a
  // quaternion as reference.
  GUIDED_MASTER: 221, // set id of master controller
  GUIDED_LIMITS: 222, // Set limits for external control
  ENGINE_CONTROL: 223, // Control vehicle engine. This is interpreted by the vehicles engine
  // controller to change the target engine
  // state. It is intended for vehicles with
  // internal combustion engines
  SET_MISSION_CURRENT: 224, // Set the mission item with sequence number seq as current item. This
  // means that the MAV will continue to this
  // mission item on the shortest path (not
  // commands in the enumeration
  MAV_CMD_PREFLIGHT_CALIBRATION: 241, // Trigger calibration. This command will be only accepted if in pre-
  // flight mode. Except for Temperature
  // Calibration, only one sensor should be set
  // in a single message and all others should
  // be zero.
  MAV_CMD_PREFLIGHT_SET_SENSOR_OFFSETS: 242, // Set sensor offsets. This command will be only accepted if in pre-
  // flight mode.
  MAV_CMD_PREFLIGHT_UAVCAN: 243, // Trigger UAVCAN config. This command will be only accepted if in pre-
  // flight mode.
  MAV_CMD_PREFLIGHT_STORAGE: 245, // Request storage of different parameter values and logs. This command
  // will be only accepted if in pre-flight
  // mode.
  MAV_CMD_PREFLIGHT_REBOOT_SHUTDOWN: 246, // Request the reboot or shutdown of system components.
  MAV_CMD_OVERRIDE_GOTO: 252, // Override current mission with command to pause mission, pause mission
  // and move to position, continue/resume
  // mission. When param 1 indicates that the
  // mission is paused (MAV_GOTO_DO_HOLD), param
  // 2 defines whether it holds in place or
  // moves to another position.
  MAV_CMD_MISSION_START: 300, // start running a mission
  MAV_CMD_COMPONENT_ARM_DISARM: 400, // Arms / Disarms a component
  MAV_CMD_GET_HOME_POSITION: 410, // Request the home position from the vehicle.
  MAV_CMD_START_RX_PAIR: 500, // Starts receiver pairing.
  MAV_CMD_GET_MESSAGE_INTERVAL: 510 // Request the interval between messages for a particular MAVLink message
};
