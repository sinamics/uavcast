export const gps_fix: any = {
  0: 'No GPS connected',
  1: 'No position',
  2: '2D position',
  3: '3D position',
  4: 'DGPS/SBAS 3D',
  5: 'RTK float 3D',
  6: 'RTK Fixed 3D',
  7: 'Static fixed',
  8: 'PPP 3D position'
};

export const power: any = {
  1: 'Main power valid',
  2: 'Servo power valid for FMU',
  4: 'USB power',
  8: 'Over-Current!',
  16: 'Over-Current!',
  32: 'Power has changed'
};

export const base_mode: any = {
  1: 'Custom Mode',
  2: 'Test Enable',
  4: 'Auto',
  8: 'Guided',
  16: 'Stabilize',
  32: 'HIL Enabled',
  64: 'Manual',
  128: 'Armed'
};
export const mav_mode = (type: number): any => {
  // See list of mav_types / modes
  // https://mavlink.io/en/messages/common.html#MAV_TYPE
  switch (type) {
    case 2:
      // See list of modes
      // https://mavlink.io/en/messages/ardupilotmega.html#PLANE_MODE
      return {
        0: 'STABILIZE',
        1: 'ACRO',
        2: 'ALT_HOLD',
        3: 'AUTO',
        4: 'GUIDED',
        5: 'LOITER',
        6: 'RTL',
        7: 'CIRCLE',
        9: 'LAND',
        11: 'DRIFT',
        13: 'SPORT',
        14: 'FLIP',
        15: 'AUTOTUNE',
        16: 'POS_HOLD',
        17: 'BRAKE',
        18: 'THROW',
        19: 'AVOID_ADSB',
        20: 'GUIDED_NOGPS',
        21: 'SMART_RTL',
        22: 'FLOWHOLD',
        23: 'FOLLOW',
        24: 'ZIGZAG',
        25: 'SYSTEMID',
        26: 'AUTOROTATE'
      };
    case 10:
      return {
        0: 'MANUAL',
        1: 'ACRO',
        3: 'STEERING',
        4: 'HOLD',
        5: 'LOITER',
        6: 'FOLLOW',
        7: 'SIMPLE',
        10: 'AUTO',
        11: 'RTL',
        12: 'SMART_RTL',
        15: 'GUIDED',
        16: 'INITIALIZING'
      };

    default:
      return {
        0: 'MANUAL',
        1: 'CIRCLE',
        2: 'STABILIZE',
        3: 'TRAINING',
        4: 'ACRO',
        5: 'FLY_BY_WIRE_A',
        6: 'FLY_BY_WIRE_B',
        7: 'CRUISE',
        8: 'AUTOTUNE',
        10: 'AUTO',
        11: 'RTL',
        12: 'LOITER',
        13: 'TAKEOFF',
        15: 'GUIDED',
        16: 'INITIALISING'
      };
  }
};

// GPS_FIX_TYPE"
// mavlink20.GPS_FIX_TYPE_NO_GPS = 0 // No GPS connected
// mavlink20.GPS_FIX_TYPE_NO_FIX = 1 // No position information, GPS is connected
// mavlink20.GPS_FIX_TYPE_2D_FIX = 2 // 2D position
// mavlink20.GPS_FIX_TYPE_3D_FIX = 3 // 3D position
// mavlink20.GPS_FIX_TYPE_DGPS = 4 // DGPS/SBAS aided 3D position
// mavlink20.GPS_FIX_TYPE_RTK_FLOAT = 5 // RTK float, 3D position
// mavlink20.GPS_FIX_TYPE_RTK_FIXED = 6 // RTK Fixed, 3D position
// mavlink20.GPS_FIX_TYPE_STATIC = 7 // Static fixed, typically used for base stations
// mavlink20.GPS_FIX_TYPE_PPP = 8 // PPP, 3D position.
// mavlink20.GPS_FIX_TYPE_ENUM_END = 9 //
