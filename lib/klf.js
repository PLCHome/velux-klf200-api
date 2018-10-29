// Copyright (c) 2018 Träger

// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

'use strict'

const Buffer = require('safe-buffer').Buffer
const Tools = require('./tools')


const ErrorNumber = {
  E0: 'Not further defined error.',
  E1: 'Unknown Command or command is not accepted at this state.',
  E2: 'ERROR on Frame Structure.',
  E7: 'Busy. Try again later.',
  E8: 'Bad system table index.',
  E12: 'Not authenticated.'
}
exports.ErrorNumber = ErrorNumber

const DaylightSavingFlag = {
  DST0:  'DST information not available',
  DST1:  'DST is NOT in effect',
  DST2:  'DST is in effect'
}
exports.DaylightSavingFlag = DaylightSavingFlag

const ActuatorType = {
  AT1: 'Venetian blind',
  AT2: 'Roller shutter',
  AT3: 'Awning (External for windows)',
  AT4: 'Window opener',
  AT5: 'Garage opener',
  AT6: 'Light',
  AT7: 'Gate opener',
  AT8: 'Rolling Door Opener',
  AT9: 'Lock',
  AT10: 'Blind',
  AT12: 'Beacon',
  AT13: 'Dual Shutter',
  AT14: 'Heating Temperature Interface',
  AT15: 'On / Off Switch',
  AT16: 'Horizontal Awning',
  AT17: 'External Venetian Blind',
  AT18: 'Louvre Blind',
  AT19: 'Curtain track',
  AT20: 'Ventilation Point',
  AT21: 'Exterior heating',
  AT22: 'Heat pump (Not currently supported)',
  AT23: 'Intrusion alarm',
  AT24: 'Swinging Shutter'
}
exports.ActuatorType = ActuatorType

const PowerSaveMode = {
  PS0: 'ALWAYS_ALIVE',
  PS1: 'LOW_POWER_MODE'
}
exports.PowerSaveMode = PowerSaveMode

const ActuatorTurnaroundTime = {
  AT0: '5 ms',
  AT1: '10 ms',
  AT2: '20 ms',
  AT3: '40 ms'
}
exports.ActuatorTurnaroundTime = ActuatorTurnaroundTime

const IOManufacturerId = {
  IO0: 'NO_TYPE (All nodes except controller)',
  IO1: 'VELUX',
  IO2: 'Somfy',
  IO3: 'Honeywell',
  IO4: 'Hörmann',
  IO5: 'ASSA ABLOY',
  IO6: 'Niko',
  IO7: 'WINDOW MASTER',
  IO8: 'Renson',
  IO9: 'CIAT',
  IO10: 'Secuyou',
  IO11: 'OVERKIZ',
  IO12: 'Atlantic Group'
}
exports.IOManufacturerId = IOManufacturerId

const DiscoverStatus = {
  DS0: 'OK. Discovered nodes. See bit array.',
  DS5: 'Failed. CS not ready.',
  DS6: 'OK. Same as DISCOVER_NODES_PERFORMED but some nodes were not added to system table (e.g. System table has reached its limit).',
  DS7: 'CS busy with another task.'
}
exports.DiscoverStatus = DiscoverStatus

const ControllerCopyMode = {
  CCM0: 'Transmitting Configuration Mode (TCM): The gateway gets key and system table from another controller.',
  CCM1: 'Receiving Configuration Mode (RCM): The gateway gives key and system table to another controller.'
}
exports.ControllerCopyMode = ControllerCopyMode

const ControllerCopyStatusTCM = {
  CCS0: 'OK. System table and key received from another io-node.',
  CCS2: 'Failed. Not possible to find another controller in receiving configuration mode.',
  CCS4: 'Failed. DTS not ready. (DTS stands for Data Transport Service)',
  CCS5: 'Failed. DTS error. Client must activate Virgin State. Reason: The Client Controller contains a defect system.',
  CCS9: 'Failed. Configuration service not ready.'
}
exports.ControllerCopyStatusTCM = ControllerCopyStatusTCM

const ControllerCopyStatusRCM = {
  CCS0: 'OK. Data transfer to or from client controller.', 
  CCS1: 'Failed. Data transfer to or from client controller interrupted.',
  CCS4: 'Ok. Receiving configuration mode is cancelled in the client controller.', 
  CCS5: 'Failed. Timeout.', 
  CCS11: 'Failed. Configuration service not ready.'
}
exports.ControllerCopyStatusRCM = ControllerCopyStatusRCM

const API = {
  GW_ERROR_NTF: 0x0000, // Provides information on what triggered the error.
  GW_REBOOT_REQ: 0x0001, // Request gateway to reboot.
  GW_REBOOT_CFM: 0x0002, // Acknowledge to GW_REBOOT_REQ command.
  GW_SET_FACTORY_DEFAULT_REQ: 0x0003, // Request gateway to clear system table, scene table and set Ethernet settings to factory default. Gateway will reboot.
  GW_SET_FACTORY_DEFAULT_CFM: 0x0004, // Acknowledge to GW_SET_FACTORY_DEFAULT_REQ command.
  GW_GET_VERSION_REQ: 0x0008, // Request version information.
  GW_GET_VERSION_CFM: 0x0009, // Acknowledge to GW_GET_VERSION_REQ command.
  GW_GET_PROTOCOL_VERSION_REQ: 0x000A, // Request KLF 200 API protocol version.
  GW_GET_PROTOCOL_VERSION_CFM: 0x000B, // Acknowledge to GW_GET_PROTOCOL_VERSION_REQ command.
  GW_GET_STATE_REQ: 0x000C, // Request the state of the gateway
  GW_GET_STATE_CFM: 0x000D, // Acknowledge to GW_GET_STATE_REQ command.
  GW_LEAVE_LEARN_STATE_REQ: 0x000E, // Request gateway to leave learn state.
  GW_LEAVE_LEARN_STATE_CFM: 0x000F, // Acknowledge to GW_LEAVE_LEARN_STATE_REQ command.

  GW_GET_NETWORK_SETUP_REQ: 0x00E0, // Request network parameters.
  GW_GET_NETWORK_SETUP_CFM: 0x00E1, // Acknowledge to GW_GET_NETWORK_SETUP_REQ.
  GW_SET_NETWORK_SETUP_REQ: 0x00E2, // Set network parameters.
  GW_SET_NETWORK_SETUP_CFM: 0x00E3, // Acknowledge to GW_SET_NETWORK_SETUP_REQ.

  GW_CS_GET_SYSTEMTABLE_DATA_REQ: 0x0100, // Request a list of nodes in the gateways system table.
  GW_CS_GET_SYSTEMTABLE_DATA_CFM: 0x0101, // Acknowledge to GW_CS_GET_SYSTEMTABLE_DATA_REQ
  GW_CS_GET_SYSTEMTABLE_DATA_NTF: 0x0102, // Acknowledge to GW_CS_GET_SYSTEM_TABLE_DATA_REQList of nodes in the gateways systemtable.
  GW_CS_DISCOVER_NODES_REQ: 0x0103, // Start CS DiscoverNodes macro in KLF200.
  GW_CS_DISCOVER_NODES_CFM: 0x0104, // Acknowledge to GW_CS_DISCOVER_NODES_REQ command.
  GW_CS_DISCOVER_NODES_NTF: 0x0105, // Acknowledge to GW_CS_DISCOVER_NODES_REQ command.
  GW_CS_REMOVE_NODES_REQ: 0x0106, // Remove one or more nodes in the systemtable.
  GW_CS_REMOVE_NODES_CFM: 0x0107, // Acknowledge to GW_CS_REMOVE_NODES_REQ.
  GW_CS_VIRGIN_STATE_REQ: 0x0108, // Clear systemtable and delete system key.
  GW_CS_VIRGIN_STATE_CFM: 0x0109, // Acknowledge to GW_CS_VIRGIN_STATE_REQ.
  GW_CS_CONTROLLER_COPY_REQ: 0x010A, // Setup KLF200 to get or give a system to or from another io-homecontrol® remote control.By a system means all nodes in the systemtable and the system key.
  GW_CS_CONTROLLER_COPY_CFM: 0x010B, // Acknowledge to GW_CS_CONTROLLER_COPY_REQ.
  GW_CS_CONTROLLER_COPY_NTF: 0x010C, // Acknowledge to GW_CS_CONTROLLER_COPY_REQ.
  GW_CS_CONTROLLER_COPY_CANCEL_NTF: 0x010D, // Cancellation of system copy to other controllers.
  GW_CS_RECEIVE_KEY_REQ: 0x010E, // Receive system key from another controller.
  GW_CS_RECEIVE_KEY_CFM: 0x010F, // Acknowledge to GW_CS_RECEIVE_KEY_REQ.
  GW_CS_RECEIVE_KEY_NTF: 0x0110, // Acknowledge to GW_CS_RECEIVE_KEY_REQ with status.
  GW_CS_PGC_JOB_NTF: 0x0111, // Information on Product Generic Configuration job initiated by press on PGC button.
  GW_CS_SYSTEM_TABLE_UPDATE_NTF: 0x0112, // Broadcasted to all clients and gives information about added and removed actuator nodes in system table.
  GW_CS_GENERATE_NEW_KEY_REQ: 0x0113, // Generate new system key and update actuators in systemtable.
  GW_CS_GENERATE_NEW_KEY_CFM: 0x0114, // Acknowledge to GW_CS_GENERATE_NEW_KEY_REQ.
  GW_CS_GENERATE_NEW_KEY_NTF: 0x0115, // Acknowledge to GW_CS_GENERATE_NEW_KEY_REQ with status.
  GW_CS_REPAIR_KEY_REQ: 0x0116, // Update key in actuators holding an old key.
  GW_CS_REPAIR_KEY_CFM: 0x0117, // Acknowledge to GW_CS_REPAIR_KEY_REQ.
  GW_CS_REPAIR_KEY_NTF: 0x0118, // Acknowledge to GW_CS_REPAIR_KEY_REQ with status.
  GW_CS_ACTIVATE_CONFIGURATION_MODE_REQ: 0x0119, // Request one or more actuator to open for configuration.
  GW_CS_ACTIVATE_CONFIGURATION_MODE_CFM: 0x011A, // Acknowledge to GW_CS_ACTIVATE_CONFIGURATION_MODE_REQ.

  GW_GET_NODE_INFORMATION_REQ: 0x0200, // Request extended information of one specific actuator node.
  GW_GET_NODE_INFORMATION_CFM: 0x0201, // Acknowledge to GW_GET_NODE_INFORMATION_REQ.
  GW_GET_NODE_INFORMATION_NTF: 0x0210, // Acknowledge to GW_GET_NODE_INFORMATION_REQ.
  GW_GET_ALL_NODES_INFORMATION_REQ: 0x0202, // Request extended information of all nodes.
  GW_GET_ALL_NODES_INFORMATION_CFM: 0x0203, // Acknowledge to GW_GET_ALL_NODES_INFORMATION_REQ
  GW_GET_ALL_NODES_INFORMATION_NTF: 0x0204, // Acknowledge to GW_GET_ALL_NODES_INFORMATION_REQ. Holds node information
  GW_GET_ALL_NODES_INFORMATION_FINISHED_NTF: 0x0205, // Acknowledge to GW_GET_ALL_NODES_INFORMATION_REQ. No more nodes.
  GW_SET_NODE_VARIATION_REQ: 0x0206, // Set node variation.
  GW_SET_NODE_VARIATION_CFM: 0x0207, // Acknowledge to GW_SET_NODE_VARIATION_REQ.
  GW_SET_NODE_NAME_REQ: 0x0208, // Set node name.
  GW_SET_NODE_NAME_CFM: 0x0209, // Acknowledge to GW_SET_NODE_NAME_REQ.
  GW_SET_NODE_VELOCITY_REQ: 0x020A, // Set node velocity.
  GW_SET_NODE_VELOCITY_CFM: 0x020B, // Acknowledge to GW_SET_NODE_VELOCITY_REQ.
  GW_NODE_INFORMATION_CHANGED_NTF: 0x020C, // Information has been updated.
  GW_NODE_STATE_POSITION_CHANGED_NTF: 0x0211, // Information has been updated.
  GW_SET_NODE_ORDER_AND_PLACEMENT_REQ: 0x020D, // Set search order and room placement.
  GW_SET_NODE_ORDER_AND_PLACEMENT_CFM: 0x020E, // Acknowledge to GW_SET_NODE_ORDER_AND_PLACEMENT_REQ.

  GW_GET_GROUP_INFORMATION_REQ: 0x0220, // Request information about all defined groups.
  GW_GET_GROUP_INFORMATION_CFM: 0x0221, // Acknowledge to GW_GET_GROUP_INFORMATION_REQ.
  GW_GET_GROUP_INFORMATION_NTF: 0x0230, // Acknowledge to GW_GET_NODE_INFORMATION_REQ.
  GW_SET_GROUP_INFORMATION_REQ: 0x0222, // Change an existing group.
  GW_SET_GROUP_INFORMATION_CFM: 0x0223, // Acknowledge to GW_SET_GROUP_INFORMATION_REQ.
  GW_GROUP_INFORMATION_CHANGED_NTF: 0x0224, // Broadcast to all, about group information of a group has been changed.
  GW_DELETE_GROUP_REQ: 0x0225, // Delete a group.
  GW_DELETE_GROUP_CFM: 0x0226, // Acknowledge to GW_DELETE_GROUP_INFORMATION_REQ.
  GW_NEW_GROUP_REQ: 0x0227, // Request new group to be created.
  GW_NEW_GROUP_CFM: 0x0228,
  GW_GET_ALL_GROUPS_INFORMATION_REQ: 0x0229, // Request information about all defined groups.
  GW_GET_ALL_GROUPS_INFORMATION_CFM: 0x022A, // Acknowledge to GW_GET_ALL_GROUPS_INFORMATION_REQ.
  GW_GET_ALL_GROUPS_INFORMATION_NTF: 0x022B, // Acknowledge to GW_GET_ALL_GROUPS_INFORMATION_REQ.
  GW_GET_ALL_GROUPS_INFORMATION_FINISHED_NTF: 0x022C, // Acknowledge to GW_GET_ALL_GROUPS_INFORMATION_REQ.
  GW_GROUP_DELETED_NTF: 0x022D, // GW_GROUP_DELETED_NTF is broadcasted to all, when a group has been removed.
  GW_HOUSE_STATUS_MONITOR_ENABLE_REQ: 0x0240, // Enable house status monitor.
  GW_HOUSE_STATUS_MONITOR_ENABLE_CFM: 0x0241, // Acknowledge to GW_HOUSE_STATUS_MONITOR_ENABLE_REQ.
  GW_HOUSE_STATUS_MONITOR_DISABLE_REQ: 0x0242, // Disable house status monitor.
  GW_HOUSE_STATUS_MONITOR_DISABLE_CFM: 0x0243, // Acknowledge to GW_HOUSE_STATUS_MONITOR_DISABLE_REQ.

  GW_COMMAND_SEND_REQ: 0x0300, // Send activating command direct to one or more io-homecontrol® nodes.
  GW_COMMAND_SEND_CFM: 0x0301, // Acknowledge to GW_COMMAND_SEND_REQ.
  GW_COMMAND_RUN_STATUS_NTF: 0x0302, // Gives run status for io-homecontrol® node.
  GW_COMMAND_REMAINING_TIME_NTF: 0x0303, // Gives remaining time before io-homecontrol® node enter target position.
  GW_SESSION_FINISHED_NTF: 0x0304, // Command send, Status request, Wink, Mode or Stop session is finished.
  GW_STATUS_REQUEST_REQ: 0x0305, // Get status request from one or more io-homecontrol® nodes.
  GW_STATUS_REQUEST_CFM: 0x0306, // Acknowledge to GW_STATUS_REQUEST_REQ.
  GW_STATUS_REQUEST_NTF: 0x0307, // Acknowledge to GW_STATUS_REQUEST_REQ. Status request from one or more io-homecontrol® nodes.
  GW_WINK_SEND_REQ: 0x0308, // Request from one or more io-homecontrol® nodes to Wink.
  GW_WINK_SEND_CFM: 0x0309, // Acknowledge to GW_WINK_SEND_REQ
  GW_WINK_SEND_NTF: 0x030A, // Status info for performed wink request.

  GW_SET_LIMITATION_REQ: 0x0310, // Set a parameter limitation in an actuator.
  GW_SET_LIMITATION_CFM: 0x0311, // Acknowledge to GW_SET_LIMITATION_REQ.
  GW_GET_LIMITATION_STATUS_REQ: 0x0312, // Get parameter limitation in an actuator.
  GW_GET_LIMITATION_STATUS_CFM: 0x0313, // Acknowledge to GW_GET_LIMITATION_STATUS_REQ.
  GW_LIMITATION_STATUS_NTF: 0x0314, // Hold information about limitation.
  GW_MODE_SEND_REQ: 0x0320, // Send Activate Mode to one or more io-homecontrol® nodes.
  GW_MODE_SEND_CFM: 0x0321, // Acknowledge to GW_MODE_SEND_REQ
  GW_MODE_SEND_NTF: 0x0322, // Notify with Mode activation info.
  GW_INITIALIZE_SCENE_REQ: 0x0400, // Prepare gateway to record a scene.
  GW_INITIALIZE_SCENE_CFM: 0x0401, // Acknowledge to GW_INITIALIZE_SCENE_REQ.
  GW_INITIALIZE_SCENE_NTF: 0x0402, // Acknowledge to GW_INITIALIZE_SCENE_REQ.
  GW_INITIALIZE_SCENE_CANCEL_REQ: 0x0403, // Cancel record scene process.
  GW_INITIALIZE_SCENE_CANCEL_CFM: 0x0404, // Acknowledge to GW_INITIALIZE_SCENE_CANCEL_REQ command.
  GW_RECORD_SCENE_REQ: 0x0405, // Store actuator positions changes since GW_INITIALIZE_SCENE, as a scene.
  GW_RECORD_SCENE_CFM: 0x0406, // Acknowledge to GW_RECORD_SCENE_REQ.
  GW_RECORD_SCENE_NTF: 0x0407, // Acknowledge to GW_RECORD_SCENE_REQ.
  GW_DELETE_SCENE_REQ: 0x0408, // Delete a recorded scene.
  GW_DELETE_SCENE_CFM: 0x0409, // Acknowledge to GW_DELETE_SCENE_REQ.
  GW_RENAME_SCENE_REQ: 0x040A, // Request a scene to be renamed.
  GW_RENAME_SCENE_CFM: 0x040B, // Acknowledge to GW_RENAME_SCENE_REQ.
  GW_GET_SCENE_LIST_REQ: 0x040C, // Request a list of scenes.
  GW_GET_SCENE_LIST_CFM: 0x040D, // Acknowledge to GW_GET_SCENE_LIST.
  GW_GET_SCENE_LIST_NTF: 0x040E, // Acknowledge to GW_GET_SCENE_LIST.
  GW_GET_SCENE_INFOAMATION_REQ: 0x040F, // Request extended information for one given scene.
  GW_GET_SCENE_INFOAMATION_CFM: 0x0410, // Acknowledge to GW_GET_SCENE_INFOAMATION_REQ.
  GW_GET_SCENE_INFOAMATION_NTF: 0x0411, // Acknowledge to GW_GET_SCENE_INFOAMATION_REQ.
  GW_ACTIVATE_SCENE_REQ: 0x0412, // Request gateway to enter a scene.
  GW_ACTIVATE_SCENE_CFM: 0x0413, // Acknowledge to GW_ACTIVATE_SCENE_REQ.
  GW_STOP_SCENE_REQ: 0x0415, // Request all nodes in a given scene to stop at their current position.
  GW_STOP_SCENE_CFM: 0x0416, // Acknowledge to GW_STOP_SCENE_REQ.
  GW_SCENE_INFORMATION_CHANGED_NTF: 0x0419, // A scene has either been changed or removed.

  GW_ACTIVATE_PRODUCTGROUP_REQ: 0x0447, // Activate a product group in a given direction.
  GW_ACTIVATE_PRODUCTGROUP_CFM: 0x0448, // Acknowledge to GW_ACTIVATE_PRODUCTGROUP_REQ.
  GW_ACTIVATE_PRODUCTGROUP_NTF: 0x0449, // Acknowledge to GW_ACTIVATE_PRODUCTGROUP_REQ.

  GW_GET_CONTACT_INPUT_LINK_LIST_REQ: 0x0460, // Get list of assignments to all Contact Input to scene or product group.
  GW_GET_CONTACT_INPUT_LINK_LIST_CFM: 0x0461, // Acknowledge to GW_GET_CONTACT_INPUT_LINK_LIST_REQ.
  GW_SET_CONTACT_INPUT_LINK_REQ: 0x0462, // Set a link from a Contact Input to a scene or product group.
  GW_SET_CONTACT_INPUT_LINK_CFM: 0x0463, // Acknowledge to GW_SET_CONTACT_INPUT_LINK_REQ.
  GW_REMOVE_CONTACT_INPUT_LINK_REQ: 0x0464, // Remove a link from a Contact Input to a scene.
  GW_REMOVE_CONTACT_INPUT_LINK_CFM: 0x0465, // Acknowledge to GW_REMOVE_CONTACT_INPUT_LINK_REQ.

  GW_GET_ACTIVATION_LOG_HEADER_REQ: 0x0500, // Request header from activation log.
  GW_GET_ACTIVATION_LOG_HEADER_CFM: 0x0501, // Confirm header from activation log.
  GW_CLEAR_ACTIVATION_LOG_REQ: 0x0502, // Request clear all data in activation log.
  GW_CLEAR_ACTIVATION_LOG_CFM: 0x0503, // Confirm clear all data in activation log.
  GW_GET_ACTIVATION_LOG_LINE_REQ: 0x0504, // Request line from activation log.
  GW_GET_ACTIVATION_LOG_LINE_CFM: 0x0505, // Confirm line from activation log.
  GW_ACTIVATION_LOG_UPDATED_NTF: 0x0506, // Confirm line from activation log.
  GW_GET_MULTIPLE_ACTIVATION_LOG_LINES_REQ: 0x0507, // Request lines from activation log.
  GW_GET_MULTIPLE_ACTIVATION_LOG_LINES_NTF: 0x0508, // Error log data from activation log.
  GW_GET_MULTIPLE_ACTIVATION_LOG_LINES_CFM: 0x0509, // Confirm lines from activation log.

  GW_SET_UTC_REQ: 0x2000, // Request to set UTC time.
  GW_SET_UTC_CFM: 0x2001, // Acknowledge to GW_SET_UTC_REQ.
  GW_RTC_SET_TIME_ZONE_REQ: 0x2002, // Set time zone and daylight savings rules.
  GW_RTC_SET_TIME_ZONE_CFM: 0x2003, // Acknowledge to GW_RTC_SET_TIME_ZONE_REQ.
  GW_GET_LOCAL_TIME_REQ: 0x2004, // Request the local time based on current time zone and daylight savings rules.
  GW_GET_LOCAL_TIME_CFM: 0x2005, // Acknowledge to GW_RTC_SET_TIME_ZONE_REQ.

  GW_PASSWORD_ENTER_REQ: 0x3000, // Enter password to authenticate request
  GW_PASSWORD_ENTER_CFM: 0x3001, // Acknowledge to GW_PASSWORD_ENTER_REQ
  GW_PASSWORD_CHANGE_REQ: 0x3002, // Request password change.
  GW_PASSWORD_CHANGE_CFM: 0x3003, // Acknowledge to GW_PASSWORD_CHANGE_REQ.
  GW_PASSWORD_CHANGE_NTF: 0x3004, // Acknowledge to GW_PASSWORD_CHANGE_REQ. Broadcasted to all connected clients.

}
exports.API = API

const APIData = {
  /*
  Command      |Data 1
  GW_ERROR_NTF |ErrorNumber

    -in
    buffer

    - out
      json data
      {
        ErrorNumber: [Number],
        Error: [string]
      }
  */
  GW_ERROR_NTF:  function (buf) {
    var data = {}
    data.ErrorNumber = buf.readUInt8(0)
    data.Error = ErrorNumber['E'+data.ErrorNumber]
    return data
  },


  /*
    Command
    GW_REBOOT_REQ

    -in
      json data
      {
      }

    - out
    null
  */
  GW_REBOOT_REQ:  function (data) {
    return null
  },


  /*
    Command
    GW_REBOOT_CFM

    -in
    buffer

    - out
      json data
      {
      }
  */
  GW_REBOOT_CFM:  function (buf) {
    var data = {}
    return data
  },


  /*
    Command
    GW_SET_FACTORY_DEFAULT_REQ

    -in
      json data
      {
      }

    - out
    null
  */
  GW_SET_FACTORY_DEFAULT_REQ:  function (data) {
    return null
  },


  /*
    Command
    GW_SET_FACTORY_DEFAULT_CFM
    -in
    buffer

    - out
      json data
      {
      }
  */
  GW_SET_FACTORY_DEFAULT_CFM:  function (buf) {
    var data = {}
    return data
  },


  /*
    Command
    GW_GET_VERSION_REQ

    Use GW_GET_VERSION_REQ to get information about current KLF200 firmware version.
    A GW_GET_VERSION_CFM frame will be returned.
    Use GW_GET_PROTOCOL_VERSION_REQ to get information of the current protocol ID used
    by gateway and what version of this specification the firmware matches.

    -in
    json data
    {
    }

    -out
    null
  */
  GW_GET_VERSION_REQ:  function (data) {
    //var buf = new Buffer(1)
    //return buf
    return null
  },


  /*
    Command            |Data 1 - 6      |Data 7          |Data 8       |Data 9
    GW_GET_VERSION_CFM |SoftwareVersion |HardwareVersion |ProductGroup |ProductType

    SoftwareVersion parameter |Description
              Data 1          |Command Version Number
              Data 2          |Version Whole Number
              Data 3          |Version Sub Number
              Data 4          |Branch ID
              Data 5          |Build Number
              Data 6          |Micro Build

    HardwareVersion parameter
    HardwareVersion is a single byte, containing the current hardware version of KLF200.

    ProductGroup parameter
    ProductGroup is a single byte, containing the product group number for the gateway, this can be used to identify the gateway.
    KLF200 is members of remote control product group, therefore ProductGroup is always 14.

    ProductType parameter
    ProductType is a single byte, containing the product type number for the gateway, this can be used to identify the gateway.
    ProductType is 3 for KLF200.


    -in
    buffer

    -out
    json data
    {
      SoftwareVersion: [array 6 of int],
      HardwareVersion: [int],
      ProductGroup: [int],
      ProductType: [int]
    }
  */
  GW_GET_VERSION_CFM:  function (buf) {
    var data = {}
    data.SoftwareVersion = [buf.readUInt8(0),buf.readUInt8(1),buf.readUInt8(2),buf.readUInt8(3),buf.readUInt8(4),buf.readUInt8(5)]
    data.HardwareVersion = buf.readUInt8(6)
    data.ProductGroup = buf.readUInt8(7)
    data.ProductType = buf.readUInt8(8)
    return data
  },


  /*
    Command
    GW_GET_PROTOCOL_VERSION_REQ

    -in
    json data
    {
    }

    -out
    null
  */
  GW_GET_PROTOCOL_VERSION_REQ:  function (data) {
    //var buf = new Buffer(1)
    //return buf
    return null
  },


  /*
    Command                     |Data 1-2     |Data 3-4
    GW_GET_PROTOCOL_VERSION_CFM |MajorVersion |MinorVersion

    -in
    buffer

    -out
    json data
    {
      MajorVersion: [int],
      MinorVersion: [int]
    }
  */
  GW_GET_PROTOCOL_VERSION_CFM:  function (buf) {
    var data = {}
    data.MajorVersion = buf.readUInt16BE(0)
    data.MinorVersion = buf.readUInt16BE(2)
    return data
  },


  /*
    Command
    GW_GET_STATE_REQ

    -in
    json data
    {
    }

    -out
    null
  */
  GW_GET_STATE_REQ:  function (data) {
    return null
  },


  /*
    Command          |Data 1       |Data 2   |Data 3 – 6
    GW_GET_STATE_CFM |GatewayState |SubState |StateData

    GatewayState value |Description
            0          |Test mode.
            1          |Gateway mode, no actuator nodes in the system table.
            2          |Gateway mode, with one or more actuator nodes in the system table.
            3          |Beacon mode, not configured by a remote controller.
            4          |Beacon mode, has been configured by a remote controller.
         5 - 255       |Reserved.


    SubState value, when    |
    GatewayState is 1 or 2  |Description
             0x00           |Idle state.
             0x01           |Performing task in Configuration Service handler
             0x02           |Performing Scene Configuration
             0x03           |Performing Information Service Configuration.
             0x04           |Performing Contact input Configuration.
                            |
                            |In Contact input Learn state. ???
                            |
             0x80           |Performing task in Command Handler
             0x81           |Performing task in Activate Group Handler
             0x82           |Performing task in Activate Scene Handler
          Other values      |Reserved.

    StateData parameter is reserved for future use.

    -in
    buffer

    -out
    json data
    {
      GatewayState: [int],
      SubState: [int]
      StateData: [array of 4 int]
    }
  */
  GW_GET_STATE_CFM:  function (buf) {
    var data = {}
    data.GatewayState = buf.readUInt8(0)
    data.SubState = buf.readUInt8(1)
    data.StateData = [buf.readUInt8(2),buf.readUInt8(3),buf.readUInt8(4),buf.readUInt8(5)]
    return data
  },


  /*
    If the gateway has been put into learn state by press learn button,
    then GW_LEAVE_LEARN_STATE_REQ can be sent, for the gateway to leave learn state.

    Command
    GW_LEAVE_LEARN_STATE_REQ

    -in
    json data
    {
    }

    -out
    null
  */
  GW_LEAVE_LEARN_STATE_REQ:  function (dataata) {
    return null
  },


  /*
    Command                  |Data 1
    GW_LEAVE_LEARN_STATE_CFM |Status

    Status value |Description
         0       |The request failed.
         1       |The request was successful.

    -in
    buffer

    - out
      json data
      {
        status: [boolean]
      }
  */
  GW_LEAVE_LEARN_STATE_CFM: function(buf){
    var data = {}
    data.status = (buf.readUInt8(0)==1)
    return data
  },


  /*
    Command
    GW_GET_NETWORK_SETUP_REQ

    -in
      json data
      {
      }

    - out
    null
  */
  GW_GET_NETWORK_SETUP_REQ:  function (date) {
    return null
  },


  /*
    Command                  |Data 1 - 4 |Data 5 - 8 |Data 9 - 12 |Data 13
    GW_GET_NETWORK_SETUP_CFM |IpAddress  |Mask       |DefGW       |DHCP

    DHCP value |Description
         0     |Disable DHCP. Use IpAddress, Mask and DefGW to setup Ethernet interface.
         1     |Enable DHCP. IpAddress, Mask and DefGW are not used to setup Ethernet interface.

    -in
    buffer

    - out
    json data
    {
      ipAddress = [array 4 of int]
      mask = [array 4 of int]
      defGW = [array 4 of int]
      dhcp = [boolean]
    }
  */
  GW_GET_NETWORK_SETUP_CFM:  function (buf) {
    var data = {}
    data.ipAddress = [buf.readUInt8(0),buf.readUInt8(1),buf.readUInt8(2),buf.readUInt8(3)]
    data.mask = [buf.readUInt8(4),buf.readUInt8(5),buf.readUInt8(6),buf.readUInt8(7)]
    data.defGW = [buf.readUInt8(8),buf.readUInt8(9),buf.readUInt8(10),buf.readUInt8(11)]
    data.dhcp = (buf.readUInt8(12)==1)
    return data
  },


  /*
    Command                  |Data 1 - 4 |Data 5 - 8 |Data 9 - 12 |Data 13
    GW_SET_NETWORK_SETUP_REQ |IpAddress  |Mask       |DefGW       |DHCP

    -in
    json data
    {
      ipAddress = [array 4 of int]
      mask = [array 4 of int]
      defGW = [array 4 of int]
      dhcp = [boolean]
    }

    - out
    buffer
  */
  GW_SET_NETWORK_SETUP_REQ:  function () {
    var buf = new Buffer(13)
    for (var i = 0;i<4;i++){
      buf.writeUInt8(data.ipAddress[0+i],0+i)
      buf.writeUInt8(data.mask[0+i],4+i)
      buf.writeUInt8(data.defGW[0+i],8+i)
    }

    buf.writeUInt8((data.dhcp?1:0),12)
    return buf
  },


  /*
    Command
    GW_SET_NETWORK_SETUP_CFM

    -in
    buffer

    - out
    json data
    {
    }
  */
  GW_SET_NETWORK_SETUP_CFM:  function (buf0) {
    data = {}
    return data
  },



  /*
    Command
    GW_CS_GET_SYSTEMTABLE_DATA_REQ

    -in
    json data
    {
    }

    -out
    null
  */
  GW_CS_GET_SYSTEMTABLE_DATA_REQ:  function (data) {
    //var buf = new Buffer(1)
    //return buf
    return null
  },


  /*
    Command
    GW_CS_GET_SYSTEMTABLE_DATA_CFM

    -in
    buffer

    - out
    json data
    {
    }
  */
  GW_CS_GET_SYSTEMTABLE_DATA_CFM:  function (buf) {
    var data = {}
    return data
  },


  /*
    Command                        |Data 1        |Data 2 – (n+1)     |Data (n+2)
    GW_CS_GET_SYSTEMTABLE_DATA_NTF |NumberOfEntry |SystemTableObjects |RemainingNumberOfEntry

    Class: General Actuator
    Byte |Index Description
     1   |System table index.
     2   |Actuator address Highest Byte
     3   |Actuator address Middle Byte
     4   |Actuator address Lowest Byte
     5-6 |Actuator Type (MSBits), Actuator Type (LSBits) – Actuator Sub Type
     7   |Bit 0-1 : PowerSave Mode
         |Bit 2 : io-Membership Bit 3 : RF support
         |Bit 6-7 : Actuator Turnaround time.
     8   |io-Manufacturer Id
     9   |Backbone reference number Highest byte
     10  |Backbone reference number Middle byte
     11  |Backbone reference number Lowest byte

    -in
    buffer

    - out
    json data
    {
      numberOfEntry : [int],
      actuator : [array of json actuator]
    }
    
    - subtype
    json actuator
    {
      systemTableIndex : [int],
      actuatorAddress : [json address],
      actuatorType : [int],
      actuatorTypeText : [string],
      actuatorSubType : [int],
      powerSaveMode : [int],
      powerSaveModeText : [string],
      ioMembership : [boolean],
      rfSupport : [boolean],
      actuatorTurnaroundTime : [int],
      actuatorTurnaroundTimeText : [string],
      ioManufacturerId : [int],
      ioManufacturerIdText : [string],
      backboneReferenceNumber : [json address]
    }
    
    json address {
      HighestByte : [int],
      HighestByte : [int],
      LowestByte : [int]
    }
  */
  GW_CS_GET_SYSTEMTABLE_DATA_NTF:  function (buf) {
    var data = {}
    var index = 0
    data.numberOfEntry = buf.readUInt8(index++)
    data.actuator = []
    for (var i = 0;i<data.numberOfEntry;i++){
      var actuator = {}
      actuator.systemTableIndex = buf.readUInt8(index++)
      actuator.actuatorAddress={HighestByte: buf.readUInt8(index++),
                                HighestByte: buf.readUInt8(index++),
                                LowestByte: buf.readUInt8(index++)}
      var at = buf.readUInt16BE(index++)
      index++
      actuator.actuatorType = at>>6
      actuator.actuatorTypeText = ActuatorType['AT'+actuator.actuatorType]
      actuator.actuatorSubType = at&0x3F
      var mode = buf.readUInt8(index++)
      actuator.powerSaveMode = mode&0x03
      actuator.powerSaveModeText = PowerSaveMode['PS'+actuator.powerSaveMode]
      actuator.ioMembership = ((mode&0x04) != 0)
      actuator.rfSupport = ((mode&0x08) != 0)
      actuator.actuatorTurnaroundTime = mode>>6
      actuator.actuatorTurnaroundTimeText = ActuatorTurnaroundTime['AT'+actuator.actuatorTurnaroundTime]
      actuator.ioManufacturerId = buf.readUInt8(index++)
      actuator.ioManufacturerIdText = IOManufacturerId['IO'+actuator.ioManufacturerId]
      actuator.backboneReferenceNumber={HighestByte: buf.readUInt8(index++),
                                        MiddleByte: buf.readUInt8(index++),
                                        LowestByte: buf.readUInt8(index++)}
      data.actuator[i] = actuator
    }
    return data
  },


  /*
    Command                  |Data 1 
    GW_CS_DISCOVER_NODES_REQ |NodeType
    
    NodeType |description 
      0      |NO_TYPE (All nodes except controller) 
      1      |Venetian blind
      2      |Roller shutter
      3      |Awning (External for windows)
      4      |Window opener
      5      |Garage opener
      6      |Light
      7      |Gate opener
      8      |Rolling Door Opener
      9      |Lock
      10     |Blind
      12     |Beacon
      13     |Dual Shutter
      14     |Heating Temperature Interface
      15     |On / Off Switch
      16     |Horizontal Awning
      17     |External Venetian Blind
      18     |Louvre Blind
      19     |Curtain track
      20     |Ventilation Point
      21     |Exterior heating
      22     |Heat pump (Not currently supported)
      23     |Intrusion alarm
      24     |Swinging Shutter
    
    
    -in
    json data
    {
      nodeType : [int]
    }

    -out
    buffer
  */
  GW_CS_DISCOVER_NODES_REQ:  function (data) {
    var buf = new Buffer(1)
    buf.writeUInt8(data.nodeType)
    console.log('bubu',buf,data)
    return buf
  },


  /*
    Command  
    GW_CS_DISCOVER_NODES_CFM 

    -in
    buffer

    - out
    json data
    {
    }

  */
  GW_CS_DISCOVER_NODES_CFM:  function (buf) {
    var data = {}
    return data
  },


  /*
    Command                  |Data 1 – 26 |Data 27 – 52      |Data 53 - 78 
    GW_CS_DISCOVER_NODES_NTF |AddedNodes  |RFConnectionError |ioKeyErrorExistingNode 
    
    Data 79-104 |Data 105-130 |Data 131 
    Removed     |Open         |DiscoverStatus 
    
    DiscoverStatus 
       value |Description 
         0   |OK. Discovered nodes. See bit array.  
         5   |Failed. CS not ready. 
         6   |OK. Same as DISCOVER_NODES_PERFORMED but some nodes were not added to system table (e.g. System table has reached its limit). 
         7   |CS busy with another task. 
    
    
    -in
    buffer

    - out
    json data
    {
      addedNodes: {json type},
      rfConnectionError: {json type},
      removed: {json type},
      open: {json type},
      discoverStatus: [integer],
      discoverStatusText: [string]
    }
    
    -subtypes
    jason type 
    {
      actuator [array 200 of int]
      beacon [array 3 of int]
    }
  */
  GW_CS_DISCOVER_NODES_NTF:  function (buf) {
    var data = {}
    var index = 0
    function read(dat) {
      for (var i = 0;i<25;i++){
        var by = buf.readUInt8(index++)
        for (var a = 0;a<8;a++){
          dat.actuator[i*8+a] = (by&0x01)
          by>>=1
        }
      }
      var by = buf.readUInt8(index++)
      for (var a = 0;a<3;a++){
        dat.beacon[a] = (by&0x01)
        by>>=1
      }
    }
    data.addedNodes={actuator:[],beacon:[]}
    data.rfConnectionError={actuator:[],beacon:[]}
    data.ioKeyErrorExistingNode={actuator:[],beacon:[]}
    data.removed ={actuator:[],beacon:[]}
    data.open ={actuator:[],beacon:[]}
    read(data.addedNodes)
    read(data.rfConnectionError)
    read(data.ioKeyErrorExistingNode)
    read(data.removed)
    read(data.open)
    data.DiscoverStatus = buf.readUInt8(index++)
    data.DiscoverStatusText = DiscoverStatus['DS'+data.DiscoverStatus]
    return data
  },


  /*
    Command                |Data 1 – 26 
    GW_CS_REMOVE_NODES_REQ |RemoveNodes 
    
    -in
    json data
    {
      removeNodes: {json type},
    }

    -out
    buffer
    
    -subtypes
    jason type 
    {
      actuator [array 200 of int]
      beacon [array 3 of int]
    }
  */
  GW_CS_REMOVE_NODES_REQ:  function (data) {
    var buf = new Buffer(26)
    buf.fill(0,26)
    var index = 0
    for (var i = 0;i<25;i++){
      var by = 0
      for (var a = 0;a<8;a++){
        if (data.removeNodes.actuator[i*8+a]){
          by+=(1<<a)
        }
      }
      buf.writeUInt8(by,index++)
    }
    var by = 0
    for (var a = 0;a<3;a++){
      if (data.removeNodes.beacon[a]){
        by+=(1<<a)
      }
    }
    buf.writeUInt8(by,index++)
    return buf
  },


  /*
    Command                |Data 1 
    GW_CS_REMOVE_NODES_CFM |SceneDeleted
    
   -in
    buffer

    - out
    json data
    {
      sceneDeleted: [boolean]
    }
  */
  GW_CS_REMOVE_NODES_CFM:  function (buf) {
    var data = {}
    data.sceneDeleted = !(!(buf.readUInt8(0)))
    return data
  },


  /*
    Command 
    GW_CS_VIRGIN_STATE_REQ

    -in
    json data
    {
    }

    -out
    null
  */
  GW_CS_VIRGIN_STATE_REQ:  function (data) {
    //var buf = new Buffer(1)
    //return buf
    return null
  },


  /*
    Command 
    GW_CS_VIRGIN_STATE_CFM 
    
    -in
    buffer

    - out
    json data
    {
    }
  */
  GW_CS_VIRGIN_STATE_CFM:  function (buf) {
    var data = {}
    return data
  },


  /*
    Command                   |Data 1 
    GW_CS_CONTROLLER_COPY_REQ |ControllerCopyMode 

    ControllerCopy Mode value |Description  
    0                         |Transmitting Configuration Mode (TCM): The gateway gets key and system table from another controller. 
    1                         |Receiving Configuration Mode (RCM): The gateway gives key and system table to another controller. 
    
    -in
    json data
    {
      controllerCopyMode: [integer]
    }

    -out
    null
  */
  GW_CS_CONTROLLER_COPY_REQ:  function (data) {
    var buf = new Buffer(1)
    buf.writeUInt8(data.controllerCopyMode,0)
    return buf
  },


  /*
    Command 
    GW_CS_CONTROLLER_COPY_CFM 

    -in
    buffer

    - out
    json data
    {
    }
  */
  GW_CS_CONTROLLER_COPY_CFM:  function (buf) {
    var data = {}
    return data
  },


  /*
    Command                   |Data 1             |Data 2 
    GW_CS_CONTROLLER_COPY_NTF |ControllerCopyMode |ControllerCopyStatus 
    
    -in
    buffer

    - out
    json data
    {
      controllerCopyMode : [integer],
      controllerCopyModeText : [string],
      controllerCopyStatus : [integer]
      controllerCopyStatusText : [string]
    }
  */
  GW_CS_CONTROLLER_COPY_NTF:  function (buf) {
    var data = {}
    data.controllerCopyMode = buf.readUInt8(0)
    data.controllerCopyModeText = ControllerCopyMode['CCM'+data.controllerCopyMode]
    data.controllerCopyStatus = buf.readUInt8(1)
    if (data.controllerCopyMode==0) {
      data.controllerCopyStatusText = ControllerCopyStatusTCM['CCS'+data.controllerCopyStatus]
    } else {
      data.controllerCopyStatusText = ControllerCopyStatusRCM['CCS'+data.controllerCopyStatus]
    }
    return data
  },


  /*
    Command 
    GW_CS_CONTROLLER_COPY_CANCEL_NTF
    
    GW_CS_CONTROLLER_COPY_CANCEL_NTF can be used to cancel the transmission of a system to another controller 
    (meaning it can only be used with ControllerCopyMode = 1). 
    It clears the timeout timer for Receiving Configuration Mode. 
    
    -in
    json data
    {
    }

    -out
    null
  */
  GW_CS_CONTROLLER_COPY_CANCEL_NTF:  function (data) {
    //var buf = new Buffer(1)
    //return buf
    return null
  },


  /*

  */
  GW_CS_RECEIVE_KEY_REQ:  function () {

  },


  /*

  */
  GW_CS_RECEIVE_KEY_CFM:  function () {

  },


  /*

  */
  GW_CS_RECEIVE_KEY_NTF:  function () {

  },


  /*

  */
  GW_CS_PGC_JOB_NTF:  function () {

  },


  /*

  */
  GW_CS_SYSTEM_TABLE_UPDATE_NTF:  function () {

  },


  /*

  */
  GW_CS_GENERATE_NEW_KEY_REQ:  function () {

  },


  /*

  */
  GW_CS_GENERATE_NEW_KEY_CFM:  function () {

  },


  /*

  */
  GW_CS_GENERATE_NEW_KEY_NTF:  function () {

  },


  /*

  */
  GW_CS_REPAIR_KEY_REQ:  function () {

  },


  /*

  */
  GW_CS_REPAIR_KEY_CFM:  function () {

  },


  /*

  */
  GW_CS_REPAIR_KEY_NTF:  function () {

  },


  /*

  */
  GW_CS_ACTIVATE_CONFIGURATION_MODE_REQ:  function () {

  },


  /*

  */
  GW_CS_ACTIVATE_CONFIGURATION_MODE_CFM:  function () {

  },



  /*

  */
  GW_GET_NODE_INFORMATION_REQ:  function () {

  },


  /*

  */
  GW_GET_NODE_INFORMATION_CFM:  function () {

  },


  /*

  */
  GW_GET_NODE_INFORMATION_NTF:  function () {

  },


  /*

  */
  GW_GET_ALL_NODES_INFORMATION_REQ:  function () {

  },


  /*

  */
  GW_GET_ALL_NODES_INFORMATION_CFM:  function () {

  },


  /*

  */
  GW_GET_ALL_NODES_INFORMATION_NTF:  function () {

  },


  /*

  */
  GW_GET_ALL_NODES_INFORMATION_FINISHED_NTF:  function () {

  },


  /*

  */
  GW_SET_NODE_VARIATION_REQ:  function () {

  },


  /*

  */
  GW_SET_NODE_VARIATION_CFM:  function () {

  },


  /*

  */
  GW_SET_NODE_NAME_REQ:  function () {

  },


  /*

  */
  GW_SET_NODE_NAME_CFM:  function () {

  },


  /*

  */
  GW_SET_NODE_VELOCITY_REQ:  function () {

  },


  /*

  */
  GW_SET_NODE_VELOCITY_CFM:  function () {

  },


  /*

  */
  GW_NODE_INFORMATION_CHANGED_NTF:  function () {

  },


  /*

  */
  GW_NODE_STATE_POSITION_CHANGED_NTF:  function () {

  },


  /*

  */
  GW_SET_NODE_ORDER_AND_PLACEMENT_REQ:  function () {

  },


  /*

  */
  GW_SET_NODE_ORDER_AND_PLACEMENT_CFM:  function () {

  },



  /*

  */
  GW_GET_GROUP_INFORMATION_REQ:  function () {

  },


  /*

  */
  GW_GET_GROUP_INFORMATION_CFM:  function () {

  },


  /*

  */
  GW_GET_GROUP_INFORMATION_NTF:  function () {

  },


  /*

  */
  GW_SET_GROUP_INFORMATION_REQ:  function () {

  },


  /*

  */
  GW_SET_GROUP_INFORMATION_CFM:  function () {

  },


  /*

  */
  GW_GROUP_INFORMATION_CHANGED_NTF:  function () {

  },


  /*

  */
  GW_DELETE_GROUP_REQ:  function () {

  },


  /*

  */
  GW_DELETE_GROUP_CFM:  function () {

  },


  /*

  */
  GW_NEW_GROUP_REQ:  function () {

  },


  /*

  */
  GW_NEW_GROUP_CFM:  function () {

  },


  /*

  */
  GW_GET_ALL_GROUPS_INFORMATION_REQ:  function () {

  },


  /*

  */
  GW_GET_ALL_GROUPS_INFORMATION_CFM:  function () {

  },


  /*

  */
  GW_GET_ALL_GROUPS_INFORMATION_NTF:  function () {

  },


  /*

  */
  GW_GET_ALL_GROUPS_INFORMATION_FINISHED_NTF:  function () {

  },


  /*

  */
  GW_GROUP_DELETED_NTF:  function () {

  },


  /*

  */
  GW_HOUSE_STATUS_MONITOR_ENABLE_REQ:  function () {

  },


  /*

  */
  GW_HOUSE_STATUS_MONITOR_ENABLE_CFM:  function () {

  },


  /*

  */
  GW_HOUSE_STATUS_MONITOR_DISABLE_REQ:  function () {

  },


  /*

  */
  GW_HOUSE_STATUS_MONITOR_DISABLE_CFM:  function () {

  },



  /*

  */
  GW_COMMAND_SEND_REQ:  function () {

  },


  /*

  */
  GW_COMMAND_SEND_CFM:  function () {

  },


  /*

  */
  GW_COMMAND_RUN_STATUS_NTF:  function () {

  },


  /*

  */
  GW_COMMAND_REMAINING_TIME_NTF:  function () {

  },


  /*

  */
  GW_SESSION_FINISHED_NTF:  function () {

  },


  /*

  */
  GW_STATUS_REQUEST_REQ:  function () {

  },


  /*

  */
  GW_STATUS_REQUEST_CFM:  function () {

  },


  /*

  */
  GW_STATUS_REQUEST_NTF:  function () {

  },


  /*

  */
  GW_WINK_SEND_REQ:  function () {

  },


  /*

  */
  GW_WINK_SEND_CFM:  function () {

  },


  /*

  */
  GW_WINK_SEND_NTF:  function () {

  },



  /*

  */
  GW_SET_LIMITATION_REQ:  function () {

  },


  /*

  */
  GW_SET_LIMITATION_CFM:  function () {

  },


  /*

  */
  GW_GET_LIMITATION_STATUS_REQ:  function () {

  },


  /*

  */
  GW_GET_LIMITATION_STATUS_CFM:  function () {

  },


  /*

  */
  GW_LIMITATION_STATUS_NTF:  function () {

  },


  /*

  */
  GW_MODE_SEND_REQ:  function () {

  },


  /*

  */
  GW_MODE_SEND_CFM:  function () {

  },


  /*

  */
  GW_MODE_SEND_NTF:  function () {

  },


  /*

  */
  GW_INITIALIZE_SCENE_REQ:  function () {

  },


  /*

  */
  GW_INITIALIZE_SCENE_CFM:  function () {

  },


  /*

  */
  GW_INITIALIZE_SCENE_NTF:  function () {

  },


  /*

  */
  GW_INITIALIZE_SCENE_CANCEL_REQ:  function () {

  },


  /*

  */
  GW_INITIALIZE_SCENE_CANCEL_CFM:  function () {

  },


  /*

  */
  GW_RECORD_SCENE_REQ:  function () {

  },


  /*

  */
  GW_RECORD_SCENE_CFM:  function () {

  },


  /*

  */
  GW_RECORD_SCENE_NTF:  function () {

  },


  /*

  */
  GW_DELETE_SCENE_REQ:  function () {

  },


  /*

  */
  GW_DELETE_SCENE_CFM:  function () {

  },


  /*

  */
  GW_RENAME_SCENE_REQ:  function () {

  },


  /*

  */
  GW_RENAME_SCENE_CFM:  function () {

  },


  /*

  */
  GW_GET_SCENE_LIST_REQ:  function () {

  },


  /*

  */
  GW_GET_SCENE_LIST_CFM:  function () {

  },


  /*

  */
  GW_GET_SCENE_LIST_NTF:  function () {

  },


  /*

  */
  GW_GET_SCENE_INFOAMATION_REQ:  function () {

  },


  /*

  */
  GW_GET_SCENE_INFOAMATION_CFM:  function () {

  },


  /*

  */
  GW_GET_SCENE_INFOAMATION_NTF:  function () {

  },


  /*

  */
  GW_ACTIVATE_SCENE_REQ:  function () {

  },


  /*

  */
  GW_ACTIVATE_SCENE_CFM:  function () {

  },


  /*

  */
  GW_STOP_SCENE_REQ:  function () {

  },


  /*

  */
  GW_STOP_SCENE_CFM:  function () {

  },


  /*

  */
  GW_SCENE_INFORMATION_CHANGED_NTF:  function () {

  },



  /*

  */
  GW_ACTIVATE_PRODUCTGROUP_REQ:  function () {

  },


  /*

  */
  GW_ACTIVATE_PRODUCTGROUP_CFM:  function () {

  },


  /*

  */
  GW_ACTIVATE_PRODUCTGROUP_NTF:  function () {

  },



  /*

  */
  GW_GET_CONTACT_INPUT_LINK_LIST_REQ:  function () {

  },


  /*

  */
  GW_GET_CONTACT_INPUT_LINK_LIST_CFM:  function () {

  },


  /*

  */
  GW_SET_CONTACT_INPUT_LINK_REQ:  function () {

  },


  /*

  */
  GW_SET_CONTACT_INPUT_LINK_CFM:  function () {

  },


  /*

  */
  GW_REMOVE_CONTACT_INPUT_LINK_REQ:  function () {

  },


  /*

  */
  GW_REMOVE_CONTACT_INPUT_LINK_CFM:  function () {

  },



  /*

  */
  GW_GET_ACTIVATION_LOG_HEADER_REQ:  function () {

  },


  /*

  */
  GW_GET_ACTIVATION_LOG_HEADER_CFM:  function () {

  },


  /*

  */
  GW_CLEAR_ACTIVATION_LOG_REQ:  function () {

  },


  /*

  */
  GW_CLEAR_ACTIVATION_LOG_CFM:  function () {

  },


  /*

  */
  GW_GET_ACTIVATION_LOG_LINE_REQ:  function () {

  },


  /*

  */
  GW_GET_ACTIVATION_LOG_LINE_CFM:  function () {

  },


  /*

  */
  GW_ACTIVATION_LOG_UPDATED_NTF:  function () {

  },


  /*

  */
  GW_GET_MULTIPLE_ACTIVATION_LOG_LINES_REQ:  function () {

  },


  /*

  */
  GW_GET_MULTIPLE_ACTIVATION_LOG_LINES_NTF:  function () {

  },


  /*

  */
  GW_GET_MULTIPLE_ACTIVATION_LOG_LINES_CFM:  function () {

  },



  /*
    The gateway has a real-time clock running at UTC.
    The client can set a local time zone and daylight savings rules.
    The UTC time must be set every time the gateway is powered on.
    UTC time can be set with GW_SET_UTC_REQ.

    Command        |Data 1 – 4
    GW_SET_UTC_REQ |utcTimeStamp

    -in
    json data
    {
      utcTimeStamp: [datetime]
      localTimeStamp: [datetime]
    }

    use localTimeStamp and the system wil calc the utcTimeStamp

    -out
    buffer
  */
  GW_SET_UTC_REQ:  function (data) {
    var buf = new Buffer(4)
    var utcTimeStamp = new Date()
    if (data.localTimeStamp) {
      utcTimeStamp = new Date(data.localTimeStamp)
      var timeoffset = utcTimeStamp.getTimezoneOffset()
      utcTimeStamp = new Date(utcTimeStamp.setMinutes(datetime.getMinutes() + timeoffset))
    } else {
      utcTimeStamp = new Date(data.utcTimeStamp)
    }
    buf.writeUInt32LE( utcTimeStamp.getTime()  / 1000, offset)
    return buf
  },


  /*
    Command
    GW_SET_UTC_CFM
  */
  GW_SET_UTC_CFM:  function (buf) {
    var data = {}
    return data
  },


  /*
    Command                  |Data 1 - 64
    GW_RTC_SET_TIME_ZONE_REQ |TimeZoneString

    TimeZoneString is a 64-byte long string, formatted as UTF-8.

    The string should be on the following form:
    :[XXX[:YYY[:NNN[:DST[:DST ...]]]]]

    Where XXX is the standard time-zone name,
    YYY is the daylight savings time-zone name,
    NNN is the time zone offset, and the DSTs are the daylight savings time rules.
    Daylight savings time will add one hour to the normal time.
    (The names are only used in the 'Z' formatter in the strftime library function.)

    The time zone offset NNN is specified as a number relative to UTC,
    possibly negative (east is positive), on the format HHMM,
    where HH is hours and MM is minutes.

    The DSTs specifes a set of rules for how daylight savings time is applied.
    The rules must be sorted in increasing date order starting from the earliest date.
    The first rule for a specific year will enable DST, the next will disable it, and so on.
    Each rule is on the following form:

      [(YYYY)]MMDD[HH][-W|+W]

    * (YYYY) is the first year the daylight savings rule was applied. It is optional.
      If not specified it will default to the same year as the previous rule or zero if no previous rule.
    * MM is the month number (1-12).
    * DD is the day of the month (1-31).
    * HH is the hour number in a 24-hour day (optional, defaults to 0).
    * +/-W specifies the day of the week the rule takes effect (where Sunday = 0, Monday = 1, etc).
      +W means that the rule applies to the first such day on or after the specified date
      and -W strictly before the date. If this is not specified, the rule will take effect
      on the exact date, regardless of the day of the week.

    On the northern hemisphere, the DST rules normally comes in pairs, a start, Aprilish, and an end, Octoberish.
    On the southern hemisphere one normally has to use three rules:
    enabling DST from start of year, disabling it in Aprilish, and then enabling it again in Octoberish.

    Examples:
    :GMT:GMT+1:0060:(1990)040102-0:100102-0
    Here, the time zone is GMT and under daylight savings time the time zone is named GMT+1.
    The time zone offset is 0060, i.e. 60 minutes from UTC.
    As of the year 1990, daylight savings time started on the Sunday before (but not on)
    1:st of April at 2am and ends on the first Sunday before (but not on) the first of October.

      :GMT+10:GMT+11:0900:(1990)010100-0:040102-0:100102-0
      Tasmania is on UTC+10 hours, with daylight savings time from first Sunday in October
      until first Sunday in April. Note, the first DST rule is for enabling from start of the year.


    -in
    json data
    {
      password: [string 64]
    }

    -out
    buffer
  */
  GW_RTC_SET_TIME_ZONE_REQ: function(data){
    var buf = new Buffer(64)
    Tools.setString(data.timeZoneString,buf,0,64,'utf8')
    return buf
  },


  /*
    Command                  |Data 1
    GW_RTC_SET_TIME_ZONE_CFM |Status

    Status value |Description
         0       |The request failed.
         1       |The request was successful.

    -in
    buffer

    - out
      json data
      {
        status: [boolean]
      }
  */
  GW_RTC_SET_TIME_ZONE_CFM: function(buf){
    var data = {}
    data.status = (buf.readUInt8(0)==1)
    return data
  },


  /*
    Command
    GW_GET_LOCAL_TIME_REQ
  */
  GW_GET_LOCAL_TIME_REQ:  function (data) {
    return null
  },


  /*
    Command               |Data 1 - 4 |Data 5 |Data 6 |Data 7
    GW_GET_LOCAL_TIME_CFM |UtcTime    |Second |Minute |Hour

    Data 8     |Data 9 |Data 10 - 11 |Data 12 |Data 13 - 14 |Data 15
    DayOfMonth |Month  |Year         |WeekDay |DayOfYear    |DaylightSavingFlag

    UtcTime parameter
    Current UNIX time stamp.

    Second parameter
    Seconds after the minute (local time), range 0-61

    Minute parameter
    Minutes after the hour (local time), range 0-59

    Hour parameter
    Hours since midnight (local time), range 0-23

    DayOfMonth parameter
    Day of the month, range 1-31

    Month parameter
    Months since January, range 0-11

    Year parameter
    Years since 1900

    WeekDay parameter
    Days since Sunday, range 0-6

    DayOfYear parameter
    Days since January 1, range 0-365


    DaylightSavingFlag parameter
    Value |Description
      -1  |DST information not available
       0  |DST is NOT in effect
       1  |DST is in effect
  */
  GW_GET_LOCAL_TIME_CFM:  function (buf) {
    var data = {}
    data.utcTime = buf.readUInt32BE(0)
    var seconds = data.utcTime
    data.utcDatetime = new Date(seconds * 1000)
    var timeoffset = data.utcDatetime.getTimezoneOffset()
    data.datetime = new Date(seconds * 1000)
    data.datetime.setMinutes(data.datetime.getMinutes() - timeoffset)
    data.second = buf.readUInt8(4)
    data.minute = buf.readUInt8(5)
    data.hour = buf.readUInt8(6)
    data.dayOfMonth = buf.readUInt8(7)
    data.month = buf.readUInt8(8)
    data.year = buf.readInt16BE(9)
    data.weekDay = buf.readUInt8(11)
    data.dayOfYear = buf.readUInt16BE(12)
    data.daylightSavingFlag = buf.readInt8(14)
    data.daylightSavingFlagTxt = DaylightSavingFlag['DST'+(data.daylightSavingFlag+1)]
    return data
  },


  /*
    Enter password to authenticate request
    Command               |Data 1-32
    GW_PASSWORD_ENTER_REQ |Password

    -in
    json data
    {
      password: [string 32]
    }

    -out
    buffer
    * Password
      The password parameter must contain a paraphrase followed by zeros.
      Last byte of Password byte array must be null terminated.
  */
  GW_PASSWORD_ENTER_REQ: function(data){
    var buf = new Buffer(32)
    Tools.setString(data.password,buf,0,32)
    return buf
  },


  /*
    Command               |Data 1
    GW_PASSWORD_ENTER_CFM |Status

    Status value |Description
         0       |The request was successful.
         1       |The request failed.

    -in
    buffer

    - out
      json data
      {
        status: [boolean]
      }
  */
  GW_PASSWORD_ENTER_CFM: function(buf){
    var data = {}
    data.status = (buf.readUInt8(0)==0)
    return data
  },


  /*
    Command                |Data 1-32       |Data 33-64
    GW_PASSWORD_CHANGE_REQ |CurrentPassword |NewPassword

    -in
    json data
    {
      currentPassword: [string 32],
      newPassword: [string 32]
    }

    -out
    buffer
    * Password
      The password parameter must contain a paraphrase followed by zeros.
      Last byte of Password byte array must be null terminated.
  */
  GW_PASSWORD_CHANGE_REQ: function(data){
    var buf = new Buffer(64)
    Tools.setString(data.currentPassword,buf,0,32)
    Tools.setString(data.newPassword,buf,33,32)
    return buf
  },


  /*
    Command                |Data 1
    GW_PASSWORD_CHANGE_CFM |Status

    Status value |Description
         0       |The request was successful.
         1       |The request failed.

    -in
    buffer

    - out
      json data
      {
        status: [boolean]
      }
  */
  GW_PASSWORD_CHANGE_NTF: function(buf){
    var data = {}
    data.status = (buf.readUInt8(0)==0)
    return data
  },


  /*
    Command                |Data 1-32
    GW_PASSWORD_CHANGE_NTF |NewPassword

    -in
    buffer

    - out
      json data
      {
        newPassword: [string32]
      }
  */
  GW_PASSWORD_CHANGE_NTF: function(buf){
    var data = {}
    data.newPassword = Tools.getString(buf0,32)
    return data
  }
}
exports.APIData = APIData

