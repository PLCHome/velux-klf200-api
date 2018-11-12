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
  0: 'Not further defined error.',
  1: 'Unknown Command or command is not accepted at this state.',
  2: 'ERROR on Frame Structure.',
  7: 'Busy. Try again later.',
  8: 'Bad system table index.',
  12: 'Not authenticated.'
}
exports.ErrorNumber = ErrorNumber

const DaylightSavingFlag = {
  '-1':  'DST information not available',
  0:  'DST is NOT in effect',
  1:  'DST is in effect'
}
exports.DaylightSavingFlag = DaylightSavingFlag

const ActuatorType = {
  1: 'Venetian blind',
  2: 'Roller shutter',
  3: 'Awning (External for windows)',
  4: 'Window opener',
  5: 'Garage opener',
  6: 'Light',
  7: 'Gate opener',
  8: 'Rolling Door Opener',
  9: 'Lock',
  10: 'Blind',
  12: 'Beacon',
  13: 'Dual Shutter',
  14: 'Heating Temperature Interface',
  15: 'On / Off Switch',
  16: 'Horizontal Awning',
  17: 'External Venetian Blind',
  18: 'Louvre Blind',
  19: 'Curtain track',
  20: 'Ventilation Point',
  21: 'Exterior heating',
  22: 'Heat pump (Not currently supported)',
  23: 'Intrusion alarm',
  24: 'Swinging Shutter'
}
exports.ActuatorType = ActuatorType

const PowerSaveMode = {
  0: 'ALWAYS_ALIVE',
  1: 'LOW_POWER_MODE'
}
exports.PowerSaveMode = PowerSaveMode

const ActuatorTurnaroundTime = {
  0: '5 ms',
  1: '10 ms',
  2: '20 ms',
  3: '40 ms'
}
exports.ActuatorTurnaroundTime = ActuatorTurnaroundTime

const IOManufacturerId = {
  0: 'NO_TYPE (All nodes except controller)',
  1: 'VELUX',
  2: 'Somfy',
  3: 'Honeywell',
  4: 'Hörmann',
  5: 'ASSA ABLOY',
  6: 'Niko',
  7: 'WINDOW MASTER',
  8: 'Renson',
  9: 'CIAT',
  10: 'Secuyou',
  11: 'OVERKIZ',
  12: 'Atlantic Group'
}
exports.IOManufacturerId = IOManufacturerId

const DiscoverStatus = {
  0: 'OK. Discovered nodes. See bit array.',
  5: 'Failed. CS not ready.',
  6: 'OK. Same as DISCOVER_NODES_PERFORMED but some nodes were not added to system table (e.g. System table has reached its limit).',
  7: 'CS busy with another task.'
}
exports.DiscoverStatus = DiscoverStatus

const ControllerCopyMode = {
  0: 'Transmitting Configuration Mode (TCM): The gateway gets key and system table from another controller.',
  1: 'Receiving Configuration Mode (RCM): The gateway gives key and system table to another controller.'
}
exports.ControllerCopyMode = ControllerCopyMode

const ControllerCopyStatusTCM = {
  0: 'OK. System table and key received from another io-node.',
  2: 'Failed. Not possible to find another controller in receiving configuration mode.',
  4: 'Failed. DTS not ready. (DTS stands for Data Transport Service)',
  5: 'Failed. DTS error. Client must activate Virgin State. Reason: The Client Controller contains a defect system.',
  9: 'Failed. Configuration service not ready.'
}
exports.ControllerCopyStatusTCM = ControllerCopyStatusTCM

const ControllerCopyStatusRCM = {
  0: 'OK. Data transfer to or from client controller.',
  1: 'Failed. Data transfer to or from client controller interrupted.',
  4: 'Ok. Receiving configuration mode is cancelled in the client controller.',
  5: 'Failed. Timeout.',
  11: 'Failed. Configuration service not ready.'
}
exports.ControllerCopyStatusRCM = ControllerCopyStatusRCM

const ChangeKeyStatus = {
  0: 'Ok. Key Change in client controller.',
  2: 'Ok. Key change in system table all nodes updated with current key.',
  3: 'Ok. Key Change in System table. Not all nodes in system table was updated with current key. Check bit array.',
  5: 'Ok. Client controller received a key.',
  7: 'Failed. Local Stimuli not disabled in all Client System table nodes. See bit array.',
  9: 'Failed. Not able to find a controller to get key from.',
  10: 'Failed. DTS not ready.',
  11: 'Failed. DTS error. At DTS error no key change will take place. Backup of beacon at the beginning of key change, is restored in the client controller.',
  16: 'Failed. CS not ready.'
}
exports.ChangeKeyStatus = ChangeKeyStatus

const PgcJobState = {
  0: 'PGC job started',
  1: 'PGC job ended. Either OK or with error.',
  2: 'CS busy with other services'
}
exports.PgcJobState = PgcJobState

const PgcJobStatus = {
  0: 'OK - PGC and CS job completed',
  1: 'Partly success.',
  2: 'Failed - Error in PGC/CS job.',
  3: 'Failed - Too long key press or cancel of CS service.'
}
exports.PgcJobStatus = PgcJobStatus

const PgcJobTypeDescription = {
  0: 'Receive system copy or only get key.',
  1: 'Receive key and distribute.',
  2: 'Transmit key (and system).',
  3: 'Generate new key and distribute or only generate new key.',
  '4_255': 'Don’t care.'
}
exports.PgcJobTypeDescription = PgcJobTypeDescription

const PgcJobTypeInitiatedBy = {
  0: 'Short PGC button press.',
  1: 'Short PGC button press.',
  2: 'Long PGC button press.',
  3: 'Very long PGC button press.',
  '4_255': 'Can initiated by Too long key press.'
}
exports.PgcJobTypeInitiatedBy = PgcJobTypeInitiatedBy

const NodeInformationStatus = {
  0: 'OK - Request accepted',
  1: 'Error – Request rejected',
  2: 'Error – Invalid node index',
  OtherValues: 'Reserved'
}
exports.NodeInformationStatus = NodeInformationStatus

const GroupInformationStatus = {
  0: 'OK - Request accepted',
  1: 'Error – Request rejected',
  2: 'Error – Invalid group index',
  OtherValues: 'Reserved'
}
exports.GroupInformationStatus = GroupInformationStatus

const AllGroupInformationStatus = {
  0: 'OK - Request accepted',
  1: 'Error – Request failed',
  2: 'Error – No groups available',
  OtherValues: 'Reserved'
}
exports.AllGroupInformationStatus = AllGroupInformationStatus

const SetGroupStatus = {
  0: 'The request was successful.',
  1: 'Failed. Command rejected.',
  2: 'Failed. Invalid parameter.'
}
exports.SetGroupStatus = SetGroupStatus

const GroupType = {
  USER_GROUP: 0,
  ROOM: 1,
  HOUSE: 2
}
exports.GroupType = GroupType

const GroupTypeDescription = {
  USER_GROUP: 'The group type is a user group.',
  ROOM: 'The group type is a Room.',
  HOUSE: 'The group type is a House.'
}
exports.GroupTypeDescription = GroupTypeDescription

const VelocityTag = {
  'DEFAULT': 0,
  'SILENT': 1,
  'FAST': 2,
  'VELOCITY_NOT_AVAILABLE': 255
}
exports.VelocityTag = VelocityTag

const VelocityDescription = {
  DEFAULT: 'The node operates by its default velocity.',
  SILENT: 'The node operates in silent mode (slow).',
  FAST: 'The node operates with fast velocity.',
  VELOCITY_NOT_AVAILABLE: 'Not supported by node.',
  OTHER: 'Not defined value.'
}
exports.VelocityDescription = VelocityDescription

const NodeVariationTag = {
  NOT_SET: 0,
  TOPHUNG: 1,
  KIP: 2,
  FLAT_ROOF: 3,
  SKY_LIGHT: 4
}
exports.NodeVariationTag = NodeVariationTag

const NodeVariationDescription = {
  NOT_SET: 'Not set',
  TOPHUNG: 'Window is a top hung window',
  KIP: 'Window is a kip window.',
  FLAT_ROOF: 'Window is a flat roof.',
  SKY_LIGHT: 'Window is a sky light.'
}
exports.NodeVariationDescription = NodeVariationDescription

const OperatingStateTag = {
  0: 'Nonexecuting',
  1: 'Error while execution',
  2: 'Not used',
  3: 'Waiting for power',
  4: 'Executing',
  5: 'Done',
  255: 'State unknown'
}
exports.OperatingStateTag = OperatingStateTag

const OperatingStateDescription = {
  0: 'This status information is only returned about an ACTIAVTE_FUNC, an ACTIVATE_MODE, an ACTIVATE_STATE or a WINK command. The parameter is unable to execute due to given conditions. An example can be that the temperature is too high. It indicates that the parameter could not execute per the contents of the present activate command.',
  1: 'This status information is only returned about an ACTIVATE_STATUS_REQ command. An error has occurred while executing. This error information will be cleared the next time the parameter is going into ‘Waiting for executing’, ‘Waiting for power’ or ‘Executing’. A parameter can have the execute status ‘Error while executing’ only if the previous execute status was ‘Executing’. Note that this execute status gives information about the previous execution of the parameter, and gives no indication whether the following execution will fail. ',
  2: 'Not used',
  3: 'The parameter is waiting for power to proceed execution.',
  4: 'Execution for the parameter is in progress',
  5: 'Done The parameter is not executing and no error has been detected. No activation of the parameter has been initiated. The parameter is ready for activation.',
  255: 'The state is unknown'
}
exports.OperatingStateDescription = OperatingStateDescription

const GroupChangeType = {
  0: 'Group Deleted',
  1: 'Information modified',
  OtherValues: 'Reserved'
}

exports.GroupChangeType = GroupChangeType

const CommandOriginator = {
  USER: 1,
  RAIN: 2,
  TIMER: 3,
  UPS: 5,
  SAAC: 8,
  WIND: 9,
  LOAD_SHEDDING: 11,
  LOCAL_LIGHT: 12,
  UNSPECIFIC_ENVIRONMENT_SENSOR: 13,
  EMERGENCY: 255
}
exports.CommandOriginator = CommandOriginator

const CommandOriginatorDescription = {
  USER: 'User Remote control causing action on actuator',
  RAIN: 'Rain sensor',
  TIMER: 'Timer controlled',
  UPS: 'UPS unit',
  SAAC: 'Stand Alone Automatic Controls',
  WIND: 'Wind sensor',
  LOAD_SHEDDING: 'Managers for requiring a particular electric load shed.',
  LOCAL_LIGHT: 'Local light sensor.',
  UNSPECIFIC_ENVIRONMENT_SENSOR: 'Used in context with commands transmitted on basis of an unknown sensor for protection of an end-product or house goods.',
  EMERGENCY: 'Used in context with emergency or security'
}
exports.CommandOriginatorDescription = CommandOriginatorDescription

const StatusWinkCommand = {
  0: 'Wink command is rejected.',
  1: 'Wink command is accepted.'
}
exports.StatusWinkCommand = StatusWinkCommand

const StatusCommand = {
  0: 'Command is rejected.',
  1: 'Command is accepted.'
}
exports.StatusCommand = StatusCommand

const StatusInput = {
  0: 'The request failed.',
  1: 'The request was successful.'
}
exports.StatusInput = StatusInput

const CommandStatusID = {
  STATUS_LOCAL_USER: 0x00,
  STATUS_USER: 0x01,
  STATUS_RAIN: 0x02,
  STATUS_TIMER: 0x03,
  STATUS_UPS: 0x05,
  STATUS_PROGRAM: 0x08,
  STATUS_WIND: 0x09,
  STATUS_MYSELF: 0x0A,
  STATUS_AUTOMATIC_CYCLE: 0x0B,
  STATUS_EMERGENCY: 0x0C,
  STATUS_UNKNOWN: 0xFF
}
exports.CommandStatusID = CommandStatusID

const CommandStatusIDDescription = {
  STATUS_LOCAL_USER: 'The status is from a local user activation. (My self)',
  STATUS_USER: 'The status is from a user activation.',
  STATUS_RAIN: 'The status is from a rain sensor activation.',
  STATUS_TIMER: 'The status is from a timer generated action.',
  STATUS_UPS: 'The status is from a UPS generated action.',
  STATUS_PROGRAM: 'The status is from an automatic program generated action.(SAAC)',
  STATUS_WIND: 'The status is from a Wind sensor generated action.',
  STATUS_MYSELF: 'The status is from an actuator generated action.',
  STATUS_AUTOMATIC_CYCLE: 'The status is from a automatic cycle generated action.',
  STATUS_EMERGENCY: 'The status is from an emergency or a security generated action.',
  STATUS_UNKNOWN: 'The status is from an unknown command originator action. Other values Not defined'
}
exports.CommandStatusIDDescription = CommandStatusIDDescription

const CommandRunStatus = {
  EXECUTION_COMPLETED: 0,
  EXECUTION_FAILED: 1,
  EXECUTION_ACTIVE: 2
}
exports.CommandRunStatus = CommandRunStatus

const CommandRunStatusDescription = {
  EXECUTION_COMPLETED: 'Execution is completed with no errors.',
  EXECUTION_FAILED: 'Execution has failed. (Get specifics in the following error code)',
  EXECUTION_ACTIVE: 'Execution is still active.'
}
exports.CommandRunStatusDescription = CommandRunStatusDescription

const CommandStatusReply = {
  UNKNOWN_STATUS_REPLY: 0x00,
  COMMAND_COMPLETED_OK: 0x01,
  NO_CONTACT: 0x02,
  MANUALLY_OPERATED: 0x03,
  BLOCKED: 0x04,
  WRONG_SYSTEMKEY: 0x05,
  PRIORITY_LEVEL_LOCKED: 0x06,
  REACHED_WRONG_POSITION: 0x07,
  ERROR_DURING_EXECUTION: 0x08,
  NO_EXECUTION: 0x09,
  CALIBRATING: 0x0A,
  POWER_CONSUMPTION_TOO_HIGH: 0x0B,
  POWER_CONSUMPTION_TOO_LOW: 0x0C,
  LOCK_POSITION_OPEN: 0x0D,
  MOTION_TIME_TOO_LONG__COMMUNICATION_ENDED: 0x0E,
  THERMAL_PROTECTION: 0x0F,
  PRODUCT_NOT_OPERATIONAL: 0x10,
  FILTER_MAINTENANCE_NEEDED: 0x11,
  BATTERY_LEVEL: 0x12,
  TARGET_MODIFIED: 0x13,
  MODE_NOT_IMPLEMENTED: 0x14,
  COMMAND_INCOMPATIBLE_TO_MOVEMENT: 0x15,
  USER_ACTION: 0x16,
  DEAD_BOLT_ERROR: 0x17,
  AUTOMATIC_CYCLE_ENGAGED: 0x18,
  WRONG_LOAD_CONNECTED: 0x19,
  COLOUR_NOT_REACHABLE: 0x1A,
  TARGET_NOT_REACHABLE: 0x1B,
  BAD_INDEX_RECEIVED: 0x1C,
  COMMAND_OVERRULED: 0x1D,
  NODE_WAITING_FOR_POWER: 0x1E,
  INFORMATION_CODE: 0xDF,
  PARAMETER_LIMITED: 0xE0,
  LIMITATION_BY_LOCAL_USER: 0xE1,
  LIMITATION_BY_USER: 0xE2,
  LIMITATION_BY_RAIN: 0xE3,
  LIMITATION_BY_TIMER: 0xE4,
  LIMITATION_BY_UPS: 0xE6,
  LIMITATION_BY_UNKNOWN_DEVICE: 0xE7,
  LIMITATION_BY_SAAC: 0xEA,
  LIMITATION_BY_WIND: 0xEB,
  LIMITATION_BY_MYSELF: 0xEC,
  LIMITATION_BY_AUTOMATIC_CYCLE: 0xED,
  LIMITATION_BY_EMERGENCY: 0xEE
}
exports.CommandStatusReply = CommandStatusReply

const CommandStatusReplyDescription = {
  UNKNOWN_STATUS_REPLY: 'Used to indicate unknown reply.',
  COMMAND_COMPLETED_OK: 'Indicates no errors detected.',
  NO_CONTACT: 'Indicates no communication to node.',
  MANUALLY_OPERATED: 'Indicates manually operated by a user.',
  BLOCKED: 'Indicates node has been blocked by an object.',
  WRONG_SYSTEMKEY: 'Indicates the node contains a wrong system key.',
  PRIORITY_LEVEL_LOCKED: 'Indicates the node is locked on this priority level.',
  REACHED_WRONG_POSITION: 'Indicates node has stopped in another position than expected.',
  ERROR_DURING_EXECUTION: 'Indicates an error has occurred during execution of command.',
  NO_EXECUTION: 'Indicates no movement of the node parameter.',
  CALIBRATING: 'Indicates the node is calibrating the parameters.',
  POWER_CONSUMPTION_TOO_HIGH: 'Indicates the node power consumption is too high.',
  POWER_CONSUMPTION_TOO_LOW: 'Indicates the node power consumption is too low.',
  LOCK_POSITION_OPEN: 'Indicates door lock errors. (Door open during lock command)',
  MOTION_TIME_TOO_LONG__COMMUNICATION_ENDED: 'Indicates the target was not reached in time.',
  THERMAL_PROTECTION: 'Indicates the node has gone into thermal protection mode.',
  PRODUCT_NOT_OPERATIONAL: 'Indicates the node is not currently operational.',
  FILTER_MAINTENANCE_NEEDED: 'Indicates the filter needs maintenance.',
  BATTERY_LEVEL: 'Indicates the battery level is low.',
  TARGET_MODIFIED: 'Indicates the node has modified the target value of the command.',
  MODE_NOT_IMPLEMENTED: 'Indicates this node does not support the mode received.',
  COMMAND_INCOMPATIBLE_TO_MOVEMENT: 'Indicates the node is unable to move in the right direction.',
  USER_ACTION: 'Indicates dead bolt is manually locked during unlock command.',
  DEAD_BOLT_ERROR: 'Indicates dead bolt error.',
  AUTOMATIC_CYCLE_ENGAGED: 'Indicates the node has gone into automatic cycle mode.',
  WRONG_LOAD_CONNECTED: 'Indicates wrong load on node.',
  COLOUR_NOT_REACHABLE: 'Indicates that node is unable to reach received colour code.',
  TARGET_NOT_REACHABLE: 'Indicates the node is unable to reach received target position.',
  BAD_INDEX_RECEIVED: 'Indicates io-protocol has received an invalid index.',
  COMMAND_OVERRULED: 'Indicates that the command was overruled by a new command.',
  NODE_WAITING_FOR_POWER: 'Indicates that the node reported waiting for power.',
  INFORMATION_CODE: 'Indicates an unknown error code received. (Hex code is shown on display)',
  PARAMETER_LIMITED: 'Indicates the parameter was limited by an unknown device. (Same as LIMITATION_BY_UNKNOWN_DEVICE)',
  LIMITATION_BY_LOCAL_USER: 'Indicates the parameter was limited by local button.',
  LIMITATION_BY_USER: 'Indicates the parameter was limited by a remote control.',
  LIMITATION_BY_RAIN: 'Indicates the parameter was limited by a rain sensor.',
  LIMITATION_BY_TIMER: 'Indicates the parameter was limited by a timer.',
  LIMITATION_BY_UPS: 'Indicates the parameter was limited by a power supply.',
  LIMITATION_BY_UNKNOWN_DEVICE: 'Indicates the parameter was limited by an unknown device. (Same as PARAMETER_LIMITED)',
  LIMITATION_BY_SAAC: 'Indicates the parameter was limited by a standalone automatic controller.',
  LIMITATION_BY_WIND: 'Indicates the parameter was limited by a wind sensor.',
  LIMITATION_BY_MYSELF: 'Indicates the parameter was limited by the node itself.',
  LIMITATION_BY_AUTOMATIC_CYCLE: 'Indicates the parameter was limited by an automatic cycle.',
  LIMITATION_BY_EMERGENCY: 'Indicates the parameter was limited by an emergency.'
}
exports.CommandStatusReplyDescription = CommandStatusReplyDescription

const NodeParameter = {
  MP: 0x00,
  FP1: 0x01,
  FP2: 0x02,
  FP3: 0x03,
  FP4: 0x04,
  FP5: 0x05,
  FP6: 0x06,
  FP7: 0x07,
  FP8: 0x08,
  FP9: 0x09,
  FP10: 0x0A,
  FP11: 0x0B,
  FP12: 0x0C,
  FP13: 0x0D,
  FP14: 0x0E,
  FP15: 0x0F,
  FP16: 0x10,
  NOT_USED: 0xFF
}
exports.NodeParameter = NodeParameter

const NodeParameterDescription = {
  MP: 'Main Parameter.',
  FP1: 'Functional Parameter number 1.',
  FP2: 'Functional Parameter number 2.',
  FP3: 'Functional Parameter number 3.',
  FP4: 'Functional Parameter number 4.',
  FP5: 'Functional Parameter number 5.',
  FP6: 'Functional Parameter number 6.',
  FP7: 'Functional Parameter number 7.',
  FP8: 'Functional Parameter number 8.',
  FP9: 'Functional Parameter number 9.',
  FP10: 'Functional Parameter number 10.',
  FP11: 'Functional Parameter number 11.',
  FP12: 'Functional Parameter number 12.',
  FP13: 'Functional Parameter number 13.',
  FP14: 'Functional Parameter number 14.',
  FP15: 'Functional Parameter number 15.',
  FP16: 'Functional Parameter number 16.',
  NOT_USED: 'Value to indicate Functional Parameter not used.',
}
exports.NodeParameterDescription = NodeParameterDescription

const RequestStatusType = {
  0: 'Request Target position',
  1: 'Request Current position',
  2: 'Request Remaining time',
  3: 'Request Main info.'
}
exports.RequestStatusType = RequestStatusType

const ContactInputAssignment = {
  0: 'ContactInput is not assigned.',
  1: 'Scene',
  2: 'ProductGroup',
  3: 'OneNodeControlledByMode',
  '4_255': 'Not defined. Will not be use.',
}
exports.ContactInputAssignment = ContactInputAssignment

const LockPriorityLevel = {
  NO: 0,
  '30MIN': 1,
  FOREVER: 2
}
exports.LockPriorityLevel = LockPriorityLevel

const LockPriorityLevelDescription = {
  NO: 'Do not lock any priority level.',
  '30MIN': 'Lock one or more priority level in 30 minutes.',
  FOREVER: 'Lock one or more priority level forever',
  OTHER: 'Not to be used!'
}
exports.LockPriorityLevelDescription = LockPriorityLevelDescription

const PriorityLevel = {
0: 'Human Protection',
1: 'Environment Protection',
2: 'User Level 1',
3: 'User Level 2',
4: 'Comfort Level 1',
5: 'Comfort Level 2',
6: 'Comfort Level 3',
7: 'Comfort Level 4'
}
exports.PriorityLevel = PriorityLevel

const OutputID = {
  '0': 'Don’t send any pulse.',
  '1': 'Send pulse to output port number 1',
  '2': 'Send pulse to output port number 2',
  '3': 'Send pulse to output port number 3',
  '4': 'Send pulse to output port number 4',
  '5': 'Send pulse to output port number 5',
  '6_255': 'Not to be used!'
}
exports.OutputID = OutputID

const PLI = {
  0: 'Disable priority (Lock for other)',
  1: 'Enable',
  2: 'Enable all',
  3: 'Keep current',
  '4_255': 'Not to be used!'
}
exports.PLI = PLI

const ModeStatus = {
0: 'OK. Accepted by Command Handler',
1: 'Failed. Rejected by Command Handler',
2: 'Failed with unknown Client ID',
3: 'Failed. Session ID already in use',
4: 'Failed. Busy – no free session slots – try again',
5: 'Failed. Illegal parameter value',
255: 'Failed. Not further defined error'
}
exports.ModeStatus = ModeStatus

const SceneStatus = {
  0: 'OK - Request accepted',
  1: 'Error - System table is empty',
  2: 'Error - Can’t store more scenes',
  'other_values': 'Reserved'
}
exports.SceneStatus = SceneStatus

const SceneStatusNTF = {
  0: 'OK - Request successful',
  1: 'Partly OK – Some nodes not initialized',
  2: 'Error – No nodes initialized',
  'other_values': 'Reserved'
}
exports.SceneStatusNTF = SceneStatusNTF

const SceneRecordStatus = {
  0: 'OK – Request successful',
  1: 'Error – Request failed',
  2: 'Error – No io-homecontrol® products has been stimulated',
  3: 'Error - Can’t store more nodes. Scene not created.',
  'other_values': 'Reserved'
}
exports.SceneRecordStatus = SceneRecordStatus

const SceneRenameStatus = {
  0: 'OK - Request accepted',
  1: 'Error – Invalid scene index',
  2: 'Error – Name already stored',
  'other_values': 'Reserved'
}
exports.SceneRenameStatus = SceneRenameStatus

const SceneChangeType = {
  0: 'Scene Deleted',
  1: 'Information modified',
  'other_values': 'Reserved'
}
exports.SceneChangeType = SceneChangeType

const SceneActivateType = {
  0: 'OK - Request accepted',
  1: 'Error – Invalid parameter',
  2: 'Error – Request rejected',
  'other_values': 'Reserved'
}
exports.SceneActivateType = SceneActivateType

const ActivateProductGroup = {
  0: 'Request accepted.',
  1: 'Unknown ProductGroupID.',
  2: 'SessionID already in use.',
  3: 'Busy, all activation slot in use. Try again later.',
  4: 'Wrong group type.',
  5: 'Not further defined error.',
  6: 'Invalid parameter used.',
  '7_255': 'Reserved'
}
exports.ActivateProductGroup = ActivateProductGroup


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

const APIFunctionOUT = {
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
  GW_SET_NETWORK_SETUP_REQ:  function (data) {
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
    return buf
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
    Tools.setActuator(data.removeNodes.actuator,buf,0)
    Tools.setBeacon(data.removeNodes.beacon,buf,25)
    return buf
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
    buf
  */
  GW_CS_CONTROLLER_COPY_REQ:  function (data) {
    var buf = new Buffer(1)
    buf.writeUInt8(data.controllerCopyMode,0)
    return buf
  },


  /*
    Command
    GW_CS_RECEIVE_KEY_REQ

    -in
    json data
    {
    }

    -out
    null
  */
  GW_CS_RECEIVE_KEY_REQ:  function (data) {
    //var buf = new Buffer(1)
    //return buf
    return null
  },


  /*
    Command
    GW_CS_GENERATE_NEW_KEY_REQ

    -in
    json data
    {
    }

    -out
    null
  */
  GW_CS_GENERATE_NEW_KEY_REQ:  function (data) {
    //var buf = new Buffer(1)
    //return buf
    return null
  },


  /*
    Command
    GW_CS_REPAIR_KEY_REQ

    -in
    json data
    {
    }

    -out
    null
  */
  GW_CS_REPAIR_KEY_REQ:  function (data) {
    //var buf = new Buffer(1)
    //return buf
    return null
  },



  /*
    Command                               |Data 1 – 26
    GW_CS_ACTIVATE_CONFIGURATION_MODE_REQ |ActivateConfiguration

    -in
    json data
    {
      activateConfiguration: {json type},
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
  GW_CS_ACTIVATE_CONFIGURATION_MODE_REQ:  function (data) {
    var buf = new Buffer(26)
    Tools.setActuator(data.activateConfiguration.actuator,buf,0)
    Tools.setBeacon(data.activateConfiguration.beacon,buf,25)
    return buf
  },


  /*
    Command                     |Data 1
    GW_GET_NODE_INFORMATION_REQ |NodeID

    -in
    json data
    {
      nodeID: [int]
    }

    -out
    buffer
  */
  GW_GET_NODE_INFORMATION_REQ:  function (data) {
    var buf = new Buffer(1)
    buf.writeUInt8(data.nodeID,0)
    return buf
  },


  /*
    Command
    GW_GET_ALL_NODES_INFORMATION_REQ

    -in
    json data
    {
    }

    -out
    null
  */
  GW_GET_ALL_NODES_INFORMATION_REQ:  function (data) {
    //var buf = new Buffer(1)
    //return buf
    return null
  },


  /*
    Command                   |Data 1 |Data 2
    GW_SET_NODE_VARIATION_REQ |NodeID |NodeVariation

    -in
    json data
    {
      nodeID: [int],
      nodeVariation: [int]
    }

    -out
    buffer
  */
  GW_SET_NODE_VARIATION_REQ:  function (data) {
    var buf = new Buffer(2)
    buf.writeUInt8(data.nodeID,0)
    buf.writeUInt8(data.nodeVariation,1)
    return buf
  },


  /*
      Command              |Data 1 |Data 2 - 65
      GW_SET_NODE_NAME_REQ |NodeID |Name

    -in
    json data
    {
      nodeID: [int],
      nodeName: [string]
    }

    -out
    buffer
  */
  GW_SET_NODE_NAME_REQ:  function (data) {
    var buf = new Buffer(65)
    buf.writeUInt8(data.nodeID,0)
    setString(data.nodeName,buf,1,64,'utf8')
    return buf
  },


  /*
    Command                  |Data 1 |Data 2
    GW_SET_NODE_VELOCITY_REQ |NodeID |NodeVelocity

    -in
    json data
    {
      nodeID: [int],
      nodeVelocity: [int]
    }

    -out
    buffer
  */
  GW_SET_NODE_VELOCITY_REQ:  function (data) {
    var buf = new Buffer(2)
    buf.writeUInt8(data.nodeID,0)
    buf.writeUInt8(data.nodeVelocity,1)
    return buf
  },


  /*
    Command                             |Data 1 |Data 2 - 3 |Data 4
    GW_SET_NODE_ORDER_AND_PLACEMENT_REQ |NodeID |Order      |Placement


    -in
    json data
    {
      nodeID: [int],
      order: [int],
      placement: [int]
    }

    -out
    buffer
  */
  GW_SET_NODE_ORDER_AND_PLACEMENT_REQ:  function (data) {
    var buf = new Buffer(4)
    buf.writeUInt8(data.nodeID,0)
    buf.writeUInt16BE(data.order,1)
    buf.writeUInt8(data.placement,2)
    return buf
  },



  /*
    Command                      |Data 1
    GW_GET_GROUP_INFORMATION_REQ |GroupID

    -in
    json data
    {
      groupID: [int]
    }

    -out
    buffer
  */
  GW_GET_GROUP_INFORMATION_REQ:  function (data) {
    var buf = new Buffer(1)
    buf.writeUInt8(data.groupID,0)
    return buf
  },


  /*
    Command                      |Data 1  |Data 2 – 3 |Data 4    |Data 5 – 68
    GW_SET_GROUP_INFORMATION_REQ |GroupID |Order      |Placement |Name

    Data 69  |Data 70       |Data 71   |Data 72      |Data 73 – 97     |Data 98 – 99
    Velocity |NodeVariation |GroupType |NbrOfObjects |ActuatorBitArray |Revision

    -in
    json data
    {
      groupID: [int],
      order: [int],
      placement: [int],
      groupName: [string],
      velocity: [int],
      nodeVariation: [int],
      groupType: [int],
      nbrOfObjects: [int],
      actuatorBitArray: [array of bool]
    }

    -out
    buf
  */
  GW_SET_GROUP_INFORMATION_REQ:  function (data) {
    var buf = new Buffer(96)
    buf.writeUInt8(data.groupID,0)
    buf.writeUInt16BE(data.order,1)
    buf.writeUInt8(data.placement,3)
    Tools.setString(data.groupName,buf,4,64,'utf8')
    buf.writeUInt8(data.velocity,68)
    buf.writeUInt8(data.nodeVariation,69)
    buf.writeUInt8(data.groupType,70)
    buf.writeUInt8(data.nbrOfObjects,71)
    Tools.setActuator(data.actuatorBitArray,buf,72)
    buf.writeUInt16BE(data.revision,97)
    return buf
  },


  /*
    Command             |Data 1
    GW_DELETE_GROUP_REQ |GroupID

    -in
    json data
    {
      groupID:  [int]
    }

    -out
    buf
  */
  GW_DELETE_GROUP_REQ:  function (data) {
    var buf = new Buffer(1)
    buf.writeUInt8(data.groupID,0)
    return buf
  },


  /*
    Command          |Data 1 - 2 |Data 3    |Data 4 - 67 |Data 68  |Data 69       |Data 70
    GW_NEW_GROUP_REQ |Order      |Placement |Name        |Velocity |NodeVariation |GroupType

    Data 71      |Data 72 – 96
    NbrOfObjects |ActuatorBitArray

    -in
    json data
    {
      order: [int],
      placement: [int],
      groupName: [string],
      velocity: [int],
      nodeVariation: [int],
      groupType: [int],
      nbrOfObjects: [int],
      actuatorBitArray: [array of bool]
    }

    -out
    buf
  */
  GW_NEW_GROUP_REQ:  function (data) {
    var buf = new Buffer(96)
    buf.writeUInt16BE(data.order,0)
    buf.writeUInt8(data.placement,2)
    Tools.setString(data.groupName,buf,3,64,'utf8')
    buf.writeUInt8(data.velocity,67)
    buf.writeUInt8(data.nodeVariation,68)
    buf.writeUInt8(data.groupType,69)
    buf.writeUInt8(data.nbrOfObjects,70)
    Tools.setActuator(data.actuatorBitArray,buf,71)
    return buf
  },


  /*
    Command                           |Data 1    |Data 2
    GW_GET_ALL_GROUPS_INFORMATION_REQ |UseFilter |GroupType

    If bUseFilter == false then request information for all groups.
    Else only request information
    for groups with same type as defined by GroupType parameter.

    GroupType
    value |Tag        |Description
      0   |USER_GROUP |The group type is a user group.
      1   |ROOM       |The group type is a Room.
      2   |HOUSE      |The group type is a House.

    -in
    json data
    {
      useFilter: [int],
      groupType: [int]
    }

    -out
    buf
  */
  GW_GET_ALL_GROUPS_INFORMATION_REQ: function (data) {
    var buf = new Buffer(2)
    buf.writeUInt8(data.useFilter,0)
    buf.writeUInt8(data.groupType,1)
    return buf
  },


  /*
    Command
    GW_HOUSE_STATUS_MONITOR_ENABLE_REQ

    -in
    json data
    {
    }

    -out
    null
  */
  GW_HOUSE_STATUS_MONITOR_ENABLE_REQ:  function (data) {
    //var buf = new Buffer(1)
    //return buf
    return null
  },


  /*
    Command
    GW_HOUSE_STATUS_MONITOR_DISABLE_REQ


    -in
    json data
    {
    }

    -out
    null
  */
  GW_HOUSE_STATUS_MONITOR_DISABLE_REQ:  function (data) {
    //var buf = new Buffer(1)
    //return buf
    return null
  },



  /*
    Command             |Data 1 – 2 |Data 3            |Data 4        |Data 5
    GW_COMMAND_SEND_REQ |SessionID  |CommandOriginator |PriorityLevel |ParameterActive

    Data 6 |Data 7 |Data 8 - 41                   |Data 42         |Data 43 – 62 |Data 63
    FPI1   |FPI2   |FunctionalParameterValueArray |IndexArrayCount |IndexArray   |PriorityLevelLock

    Data 64 |Data 65 |Data 66
    PL_0_3  |PL_4_7  |LockTime


    CommandOriginator
    value |Tag                           |Description
      1   |USER                          |User Remote control causing action on actuator
      2   |RAIN                          |Rain sensor
      3   |TIMER                         |Timer controlled
      5   |UPS                           |UPS unit
      8   |SAAC                          |Stand Alone Automatic Controls
      9   |WIND                          |Wind sensor
      11  |LOAD_SHEDDING                 |Managers for requiring a particular electric load shed.
      12  |LOCAL_LIGHT                   |Local light sensor.
      13  |UNSPECIFIC_ENVIRONMENT_SENSOR |Used in context with commands transmitted on basis of an unknown sensor for protection of an end-product or house goods.
      255 |EMERGENCY                     |Used in context with emergency or security commands


    PriorityLevel parameter
    Level      |Number |Class           |Description
    Protection |0      |Human           |Provide the most secured level.
               |       |Protection      |Since consequences of misusing this level can deeply impact the
               |       |                |system behaviour, and therefore the io-homecontrol image, it
               |       |                |is mandatory for the manufacturer that wants to use this level
               |       |                |of priority to receive an agreement from io-homecontrol®
               |       |                |In any case the reception of such a command will disable all
               |       |                |categories (Level 0 to 7).
               |1      |Environment     |Used by local sensors that are relative to goods protection: endproduct
               |       |Protection      |protection, house goods protection.
               |       |                |Examples: wind sensor on a terrace awning, rain sensor on a roof window, etc.
    User       |2      |User Level 1    |Used by controller to send one (or a set of one shot) immediate
               |       |                |action commands when user manually requested for this.
               |       |                |Controllers prescribed as having a higher level of priority than
               |       |                |others use this level.
               |       |                |For example, this level can be used in combination with a lock
               |       |                |command on other levels of priority, for providing an exclusive
               |       |                |access to actuators control. e.g Parents/Children different
               |       |                |access rights, …
               |3      |User Level 2    |Used by controller to send one (or a set of one shot) immediate
               |       |                |action commands when user manually requested for this.
               |       |                |This level is the default level used by controllers.
    Comfort    |4      |Comfort Level 1 |TBD. Don’t use
               |5      |Comfort Level 2 |Used by Stand Alone Automatic Controls
               |6      |Comfort Level 3 |TBD. Don’t use
               |7      |Comfort Level 4 |TBD. Don’t use


    ParameterActive
    value |Tag  |Description
      0   |MP   |Main Parameter.
      1   |FP1  |Functional Parameter number 1.
      2   |FP2  |Functional Parameter number 2.
      3   |FP3  |Functional Parameter number 3.
      4   |FP4  |Functional Parameter number 4.
      5   |FP5  |Functional Parameter number 5.
      6   |FP6  |Functional Parameter number 6.
      7   |FP7  |Functional Parameter number 7.
      8   |FP8  |Functional Parameter number 8.
      9   |FP9  |Functional Parameter number 9.
      10  |FP10 |Functional Parameter number 10.
      11  |FP11 |Functional Parameter number 11.
      12  |FP12 |Functional Parameter number 12.
      13  |FP13 |Functional Parameter number 13.
      14  |FP14 |Functional Parameter number 14.
      15  |FP15 |Functional Parameter number 15.
      16  |FP16 |Functional Parameter number 16.


    PriorityLevelLock
    value |Description
      0   |Do not set a new lock on priority level. Information in the parameters PL_0_3, PL_4_7
          |and LockTime are not used. This is the one typically used.
      1   |Information in the parameters PL_0_3, PL_4_7 and LockTime are used to lock one or
          |more priority level.


    PLI information
    Value |Name             |Description
      0   |Disable priority |Disable the priority related to the Master
      1   |Enable           |Enable the priority related to the Master
      2   |Enable all       |Enable all pool entry for the specified priority level
          |                 |Must be used with caution!
      3   |Keep current     |Do not make any action. When used, the priority setting
          |                 |for the specific level will be kept in its current state.



    LockTime ((value+1)*30)
    value  |Description
      0    |30 seconds
      1    |60 seconds
      :    |    :
     254   |7650 seconds
           |(127 min 30 sec)
     255   |Unlimited time

    -in
    json data
    {
      *sessionID: [optional int],
      commandOriginator: [int],
      priorityLevel: [int],
      parameterActive: [int],
      functionalParameterMP: [int/value],
      functionalParameterArray [array of functionalParameter]
      indexArrayCount: [int],
      indexArray: [array of int],
      priorityLevelLock: [bool],
      priorityLevel_0_7: [array[8] if int],
      lockTime: [int]
    }

    -out
    buffer

    -subtype
    json functionalParameter
    {
      enabled: [boolean],
      prameter : [int/value]
    }
    json value {
      value: [fload],
      valueType: [string],
      rawValue: [int]
    }
  */
  GW_COMMAND_SEND_REQ:  function (data) {
    var buf = new Buffer(66)
    buf.fill(0)
    buf.writeUInt16BE(Tools.getSessionID(data.sessionID),0)
    buf.writeUInt8(data.commandOriginator,2)
    buf.writeUInt8(data.priorityLevel,3)
    buf.writeUInt8(data.parameterActive,4)

    buf.writeUInt16BE(Tools.calcPosition(data.functionalParameterMP),7)
    var FPI1_FPI2 = 0
    if (Array.isArray(data.functionalParameterArray)) {
      for (i=0; i<16; i++){
        if (typeof data.functionalParameterArray[i] !== 'undefined' && data.functionalParameterArray[i].enabled){
          if (typeof data.functionalParameterArray[i].prameter !== 'undefined') {
            FPI1_FPI2+=1<<15-i
            buf.writeUInt16BE(Tools.calcPosition(data.functionalParameterArray[i].prameter),9+(i*2))
          }
        }
      }
    }
    buf.writeUInt16BE(FPI1_FPI2,5)
    buf.writeUInt8(data.indexArrayCount,41)
    for (var i=0; i<data.indexArrayCount&&i<20; i++){
      buf.writeUInt8(data.indexArray[i],42+i)
    }
    buf.writeUInt8(data.priorityLevelLock,62)
    if (data.priorityLevelLock) {
      var priorityLevel_0_7 = ((data.priorityLevel_0_7[0]&0x3)<<6)+
                          ((data.priorityLevel_0_7[1]&0x3)<<4)+
                          ((data.priorityLevel_0_7[2]&0x3)<<2)+
                          ((data.priorityLevel_0_7[3]&0x3))
      buf.writeUInt8(priorityLevel_0_7,63)
      var priorityLevel_0_7 = ((data.priorityLevel_0_7[4]&0x3)<<6)+
                          ((data.priorityLevel_0_7[5]&0x3)<<4)+
                          ((data.priorityLevel_0_7[6]&0x3)<<2)+
                          ((data.priorityLevel_0_7[7]&0x3))
      buf.writeUInt8(priorityLevel_0_7,64)
    }
    buf.writeUInt8(data.lockTime,65)

    return buf
  },


  /*
    Command               |Data 1 – 2 |Data 3          |Data 4 – 23 |Data 24
    GW_STATUS_REQUEST_REQ |SessionID  |IndexArrayCount |IndexArray  |StatusType

    Data 25 |Data 26
    FPI1    |FPI2


    StatusType
       value     |Description
         0       |Request Target position
         1       |Request Current position
         2       |Request Remaining time
         3       |Request Main info.
    Other values |Not valid value.

    -in
    json data
    {
      *sessionID: [optional int],
      indexArrayCount: [int],
      indexArray: [array of int],
      statusType: [int],
      functionalParameter [array of functionalParameter]
    }

    -out
    buffer

    -subtype
    json functionalParameter
    {
      enabled: [boolean],
    }
  */
  GW_STATUS_REQUEST_REQ:  function (data) {
    var buf = new Buffer(26)
    buf.fill(0)
    buf.writeUInt16BE(Tools.getSessionID(data.sessionID),0)
    buf.writeUInt8(data.indexArrayCount,2)
    for (var i=0; i<data.indexArrayCount&&i<20; i++){
      buf.writeUInt8(data.indexArray[i],3+i)
    }
    buf.writeUInt8(data.statusType,23)
    var FPI1_FPI2 = 0
    if (Array.isArray(data.functionalParameterArray)) {
      for (i=0; i<16; i++){
        if (typeof data.functionalParameterArray[i] !== 'undefined' && data.functionalParameterArray[i].enabled){
          FPI1_FPI2+=1<<15-i
        }
      }
    }
    buf.writeUInt16BE(FPI1_FPI2,24)
    return buf
  },


  /*
    Command          |Data 1 – 2 |Data 3            |Data 4        |Data 5    |Data 6
    GW_WINK_SEND_REQ |SessionID  |CommandOriginator |PriorityLevel |WinkState |WinkTime

    Data 7          |Data 8 – 27
    IndexArrayCount |IndexArray

    CommandOriginator
    value |Tag                           |Description
      1   |USER                          |User Remote control causing action on actuator
      2   |RAIN                          |Rain sensor
      3   |TIMER                         |Timer controlled
      5   |UPS                           |UPS unit
      8   |SAAC                          |Stand Alone Automatic Controls
      9   |WIND                          |Wind sensor
      11  |LOAD_SHEDDING                 |Managers for requiring a particular electric load shed.
      12  |LOCAL_LIGHT                   |Local light sensor.
      13  |UNSPECIFIC_ENVIRONMENT_SENSOR |Used in context with commands transmitted on basis of an unknown sensor for protection of an end-product or house goods.
      255 |EMERGENCY                     |Used in context with emergency or security commands

    PriorityLevel parameter
    Level      |Number |Class           |Description
    Protection |0      |Human           |Provide the most secured level.
               |       |Protection      |Since consequences of misusing this level can deeply impact the
               |       |                |system behaviour, and therefore the io-homecontrol image, it
               |       |                |is mandatory for the manufacturer that wants to use this level
               |       |                |of priority to receive an agreement from io-homecontrol®
               |       |                |In any case the reception of such a command will disable all
               |       |                |categories (Level 0 to 7).
               |1      |Environment     |Used by local sensors that are relative to goods protection: endproduct
               |       |Protection      |protection, house goods protection.
               |       |                |Examples: wind sensor on a terrace awning, rain sensor on a roof window, etc.
    User       |2      |User Level 1    |Used by controller to send one (or a set of one shot) immediate
               |       |                |action commands when user manually requested for this.
               |       |                |Controllers prescribed as having a higher level of priority than
               |       |                |others use this level.
               |       |                |For example, this level can be used in combination with a lock
               |       |                |command on other levels of priority, for providing an exclusive
               |       |                |access to actuators control. e.g Parents/Children different
               |       |                |access rights, …
               |3      |User Level 2    |Used by controller to send one (or a set of one shot) immediate
               |       |                |action commands when user manually requested for this.
               |       |                |This level is the default level used by controllers.
    Comfort    |4      |Comfort Level 1 |TBD. Don’t use
               |5      |Comfort Level 2 |Used by Stand Alone Automatic Controls
               |6      |Comfort Level 3 |TBD. Don’t use
               |7      |Comfort Level 4 |TBD. Don’t use

    WinkState
    value |Description
      0   |Disable wink
      1   |Enable wink

    WinkTime
    value  |Description
     0     |Stop wink.
     1     |Wink in 1 sec.
     2     |Wink in 2 sec.
     :     |      :
     253   |Wink in 253 sec.
     254   |Manufacturer specific wink time.
           |Can be different from actuator to actuator.
     255   |Wink forever

    -in
    json data
    {
      *sessionID: [optional int]
      commandOriginator: [int of CommandOriginator]
      priorityLevel: [int]
      winkStat: [bool]
      winkTime: [int]
      indexArrayCount: [int]
      indexArray: [arry of int]
    }

    -out
    buffer
  */
  GW_WINK_SEND_REQ:  function (data) {
    var buf = new Buffer(27)
    buf.fill(0)
    buf.writeUInt16BE(Tools.getSessionID(data.sessionID),0)
    buf.writeUInt8(data.commandOriginator,2)
    buf.writeUInt8(data.priorityLevel,3)
    buf.writeUInt8(data.winkStat,4)
    buf.writeUInt8(data.winkTime,5)
    buf.writeUInt8(data.indexArrayCount,6)
    for (var i=0; i<data.indexArrayCount&&i<20; i++){
      buf.writeUInt8(data.indexArray[i],7+i)
    }
    return buf
  },


  /*
    Command               |Data 1 - 2 |Data 3            |Data 4        |Data 5
    GW_SET_LIMITATION_REQ |SessionID  |CommandOriginator |PriorityLevel |IndexArrayCount

    Data 6 – 25    |Data 26     |Data 27 - 28       |Data 29 - 30       |Data 31
    IndexArray[20] |ParameterID |LimitationValueMin |LimitationValueMax |LimitationTime

    CommandOriginator
    value |Tag                           |Description
      1   |USER                          |User Remote control causing action on actuator
      2   |RAIN                          |Rain sensor
      3   |TIMER                         |Timer controlled
      5   |UPS                           |UPS unit
      8   |SAAC                          |Stand Alone Automatic Controls
      9   |WIND                          |Wind sensor
      11  |LOAD_SHEDDING                 |Managers for requiring a particular electric load shed.
      12  |LOCAL_LIGHT                   |Local light sensor.
      13  |UNSPECIFIC_ENVIRONMENT_SENSOR |Used in context with commands transmitted on basis of an unknown sensor for protection of an end-product or house goods.
      255 |EMERGENCY                     |Used in context with emergency or security commands

    PriorityLevel parameter
    Level      |Number |Class           |Description
    Protection |0      |Human           |Provide the most secured level.
               |       |Protection      |Since consequences of misusing this level can deeply impact the
               |       |                |system behaviour, and therefore the io-homecontrol image, it
               |       |                |is mandatory for the manufacturer that wants to use this level
               |       |                |of priority to receive an agreement from io-homecontrol®
               |       |                |In any case the reception of such a command will disable all
               |       |                |categories (Level 0 to 7).
               |1      |Environment     |Used by local sensors that are relative to goods protection: endproduct
               |       |Protection      |protection, house goods protection.
               |       |                |Examples: wind sensor on a terrace awning, rain sensor on a roof window, etc.
    User       |2      |User Level 1    |Used by controller to send one (or a set of one shot) immediate
               |       |                |action commands when user manually requested for this.
               |       |                |Controllers prescribed as having a higher level of priority than
               |       |                |others use this level.
               |       |                |For example, this level can be used in combination with a lock
               |       |                |command on other levels of priority, for providing an exclusive
               |       |                |access to actuators control. e.g Parents/Children different
               |       |                |access rights, …
               |3      |User Level 2    |Used by controller to send one (or a set of one shot) immediate
               |       |                |action commands when user manually requested for this.
               |       |                |This level is the default level used by controllers.
    Comfort    |4      |Comfort Level 1 |TBD. Don’t use
               |5      |Comfort Level 2 |Used by Stand Alone Automatic Controls
               |6      |Comfort Level 3 |TBD. Don’t use
               |7      |Comfort Level 4 |TBD. Don’t use

    ParameterID
    value |Tag  |Description
      0   |MP   |Main Parameter.
      1   |FP1  |Functional Parameter number 1.
      2   |FP2  |Functional Parameter number 2.
      3   |FP3  |Functional Parameter number 3.
      4   |FP4  |Functional Parameter number 4.
      5   |FP5  |Functional Parameter number 5.
      6   |FP6  |Functional Parameter number 6.
      7   |FP7  |Functional Parameter number 7.
      8   |FP8  |Functional Parameter number 8.
      9   |FP9  |Functional Parameter number 9.
      10  |FP10 |Functional Parameter number 10.
      11  |FP11 |Functional Parameter number 11.
      12  |FP12 |Functional Parameter number 12.
      13  |FP13 |Functional Parameter number 13.
      14  |FP14 |Functional Parameter number 14.
      15  |FP15 |Functional Parameter number 15.
      16  |FP16 |Functional Parameter number 16.

      Limitation timer
      0   = 30 seconds
      1   = 60 seconds
      ..
      252 = 7590 seconds (126 min 30 sec)
      253 = unlimited
      254 = clear entry for the Master
      255 = clear all

    -in
    json data
    {
      *sessionID: [optional int],
      commandOriginator: [int],
      priorityLevel: [int],
      indexArrayCount: [int],
      indexArray: [array of int],
      parameterID: [int],
      limitationValueMin: [value],
      limitationValueMax: [value],
      limitationTime: [int]
    }

    -out
    buffer

    -subtype
    json value {
      value: [fload],
      valueType: [string],
      rawValue: [int]
    }
  */
  GW_SET_LIMITATION_REQ:  function (data) {
    var buf = new Buffer(31)
    buf.writeUInt16BE(Tools.getSessionID(data.sessionID),0)
    buf.writeUInt8(data.commandOriginator,2)
    buf.writeUInt8(data.priorityLevel,3)
    buf.writeUInt8(data.indexArrayCount,4)
    for (var i=0; i<data.indexArrayCount&&i<20; i++){
      buf.writeUInt8(data.indexArray[i],5+i)
    }
    buf.writeUInt8(data.parameterID,25)
    buf.writeUInt16BE(Tools.calcPosition(data.limitationValueMin),26)
    buf.writeUInt16BE(Tools.calcPosition(data.limitationValueMax),28)
    buf.writeUInt8(data.limitationTime,30)
    return buf
  },


  /*
    Command                      |Data 1 - 2 |Data 3            |Data 4        |Data 5
    GW_GET_LIMITATION_STATUS_REQ |SessionID  |CommandOriginator |PriorityLevel |IndexArrayCount

    Data 6 – 25    |Data 26     |Data 27
    IndexArray[20] |ParameterID |LimitationType


    CommandOriginator
    value |Tag                           |Description
      1   |USER                          |User Remote control causing action on actuator
      2   |RAIN                          |Rain sensor
      3   |TIMER                         |Timer controlled
      5   |UPS                           |UPS unit
      8   |SAAC                          |Stand Alone Automatic Controls
      9   |WIND                          |Wind sensor
      11  |LOAD_SHEDDING                 |Managers for requiring a particular electric load shed.
      12  |LOCAL_LIGHT                   |Local light sensor.
      13  |UNSPECIFIC_ENVIRONMENT_SENSOR |Used in context with commands transmitted on basis of an unknown sensor for protection of an end-product or house goods.
      255 |EMERGENCY                     |Used in context with emergency or security commands

    PriorityLevel parameter
    Level      |Number |Class           |Description
    Protection |0      |Human           |Provide the most secured level.
               |       |Protection      |Since consequences of misusing this level can deeply impact the
               |       |                |system behaviour, and therefore the io-homecontrol image, it
               |       |                |is mandatory for the manufacturer that wants to use this level
               |       |                |of priority to receive an agreement from io-homecontrol®
               |       |                |In any case the reception of such a command will disable all
               |       |                |categories (Level 0 to 7).
               |1      |Environment     |Used by local sensors that are relative to goods protection: endproduct
               |       |Protection      |protection, house goods protection.
               |       |                |Examples: wind sensor on a terrace awning, rain sensor on a roof window, etc.
    User       |2      |User Level 1    |Used by controller to send one (or a set of one shot) immediate
               |       |                |action commands when user manually requested for this.
               |       |                |Controllers prescribed as having a higher level of priority than
               |       |                |others use this level.
               |       |                |For example, this level can be used in combination with a lock
               |       |                |command on other levels of priority, for providing an exclusive
               |       |                |access to actuators control. e.g Parents/Children different
               |       |                |access rights, …
               |3      |User Level 2    |Used by controller to send one (or a set of one shot) immediate
               |       |                |action commands when user manually requested for this.
               |       |                |This level is the default level used by controllers.
    Comfort    |4      |Comfort Level 1 |TBD. Don’t use
               |5      |Comfort Level 2 |Used by Stand Alone Automatic Controls
               |6      |Comfort Level 3 |TBD. Don’t use
               |7      |Comfort Level 4 |TBD. Don’t use

    ParameterID
    value |Tag  |Description
      0   |MP   |Main Parameter.
      1   |FP1  |Functional Parameter number 1.
      2   |FP2  |Functional Parameter number 2.
      3   |FP3  |Functional Parameter number 3.
      4   |FP4  |Functional Parameter number 4.
      5   |FP5  |Functional Parameter number 5.
      6   |FP6  |Functional Parameter number 6.
      7   |FP7  |Functional Parameter number 7.
      8   |FP8  |Functional Parameter number 8.
      9   |FP9  |Functional Parameter number 9.
      10  |FP10 |Functional Parameter number 10.
      11  |FP11 |Functional Parameter number 11.
      12  |FP12 |Functional Parameter number 12.
      13  |FP13 |Functional Parameter number 13.
      14  |FP14 |Functional Parameter number 14.
      15  |FP15 |Functional Parameter number 15.
      16  |FP16 |Functional Parameter number 16.

    LimitationType
    value |Description
      0   |Resulting minimum limitation.
      1   |Resulting maximum limitation.


    -in
    json data
    {
      *sessionID: [optional int],
      commandOriginator: [int],
      priorityLevel: [int],
      indexArrayCount: [int],
      indexArray: [array of int],
      parameterID: [int],
      limitationType: [int]
    }

    -out
    buf
  */
  GW_GET_LIMITATION_STATUS_REQ:  function (data) {
    var buf = new Buffer(27)
    buf.writeUInt16BE(Tools.getSessionID(data.sessionID),0)
    buf.writeUInt8(data.commandOriginator,2)
    buf.writeUInt8(data.priorityLevel,3)
    buf.writeUInt8(data.indexArrayCount,4)
    for (var i=0; i<data.indexArrayCount&&i<20; i++){
      buf.writeUInt8(data.indexArray[i],5+i)
    }
    buf.writeUInt8(data.parameterID,25)
    buf.writeUInt8(data.limitationType,26)
    return buf
  },


  /*
    Command          |Data 1 – 2 |Data 3            |Data 4        |Data 5     |Data 6
    GW_MODE_SEND_REQ |SessionID  |CommandOriginator |PriorityLevel |ModeNumber |ModeParameter

    Data 7          |Data 8-27  |Data 28           |Data 29 |Data 30 |Data 31
    IndexArrayCount |IndexArray |PriorityLevelLock |PL_0_3  |PL_4_7  |LockTime

    -in
    json data
    {
      *sessionID: [optional int],
      commandOriginator: [int],
      priorityLevel: [int],
      modeNumber: [int],
      modeParameter: [int/value],
      indexArrayCount: [int],
      indexArray: [array of int],
      priorityLevelLock: [bool],
      priorityLevel_0_7: [array[8] if int],
      lockTime: [int]
    }

    -out
    buf
  */
  GW_MODE_SEND_REQ:  function (data) {
    var buf = new Buffer(31)
    buf.fill(0)
    buf.writeUInt16BE(Tools.getSessionID(data.sessionID),0)
    buf.writeUInt8(data.commandOriginator,2)
    buf.writeUInt8(data.priorityLevel,3)
    buf.writeUInt8(data.modeNumber,4)
    buf.writeUInt8(data.modeParameter,5)
    buf.writeUInt8(data.indexArrayCount,6)
    for (var i=0; i<data.indexArrayCount&&i<20; i++){
      buf.writeUInt8(data.indexArray[i],7+i)
    }
    buf.writeUInt8(data.priorityLevelLock,27)
    if (data.priorityLevelLock) {
      var priorityLevel_0_7 = ((data.priorityLevel_0_7[0]&0x3)<<6)+
                          ((data.priorityLevel_0_7[1]&0x3)<<4)+
                          ((data.priorityLevel_0_7[2]&0x3)<<2)+
                          ((data.priorityLevel_0_7[3]&0x3))
      buf.writeUInt8(priorityLevel_0_7,28)
      var priorityLevel_0_7 = ((data.priorityLevel_0_7[4]&0x3)<<6)+
                          ((data.priorityLevel_0_7[5]&0x3)<<4)+
                          ((data.priorityLevel_0_7[6]&0x3)<<2)+
                          ((data.priorityLevel_0_7[7]&0x3))
      buf.writeUInt8(priorityLevel_0_7,29)
    }
    buf.writeUInt8(data.lockTime,30)
    return buf
  },


  /*
    Command
    GW_INITIALIZE_SCENE_REQ

    -in
    json data
    {
    }

    -out
    null
  */
  GW_INITIALIZE_SCENE_REQ:  function (data) {
    //var buf = new Buffer(1)
    //return buf
    return null
  },


  /*
    Command
    GW_INITIALIZE_SCENE_CANCEL_REQ

    json data
    {
    }

    -out
    null
  */
  GW_INITIALIZE_SCENE_CANCEL_REQ:  function (data) {
    //var buf = new Buffer(1)
    //return buf
    return null
  },

  /*
    Command             |Data 1 - 64
    GW_RECORD_SCENE_REQ |SceneName

    json data
    {
      sceneName: [string]
    }

    -out
    buffer
  */
  GW_RECORD_SCENE_REQ:  function (data) {
    var buf = new Buffer(64)
    Tools.setString(data.sceneName,buf,0,64)
    return buf
  },


  /*
    Command             |Data 1
    GW_DELETE_SCENE_REQ |SceneID

    -in
    json data
    {
      sceneID: [int]
    }

    -out
    buffer
  */
  GW_DELETE_SCENE_REQ:  function (data) {
    var buf = new Buffer(1)
    buf.writeUInt8(data.sceneID,0)
    return buf
  },


  /*
    Command             |Data 1  |Data 2 - 65
    GW_RENAME_SCENE_REQ |SceneID |SceneName

    -in
    json data
    {
      sceneID: [int],
      sceneName: [string]
    }

    -out
    buffer
  */
  GW_RENAME_SCENE_REQ:  function (data) {
    var buf = new Buffer(65)
    buf.writeUInt8(data.sceneID,0)
    Tools.setString(data.sceneName,buf,1,64)
    return buf
  },


  /*
    Command
    GW_GET_SCENE_LIST_REQ

    -in
    json data
    {
    }

    -out
    null
  */
  GW_GET_SCENE_LIST_REQ:  function (data) {
    //var buf = new Buffer(1)
    //return buf
    return null
  },


  /*
    Command                      |Data 1
    GW_GET_SCENE_INFOAMATION_REQ |SceneID


    -in
    json data
    {
      sceneID: [int]
    }

    -out
    buffer
  */
  GW_GET_SCENE_INFOAMATION_REQ:  function (data) {
    var buf = new Buffer(1)
    buf.writeUInt8(data.sceneID,0)
    return buf
  },


  /*
    Command               |Data 1 – 2 |Data 3            |Data 4        |Data 5  |Data 6
    GW_ACTIVATE_SCENE_REQ |SessionID  |CommandOriginator |PriorityLevel |SceneID |Velocity

    CommandOriginator
    value |Tag                           |Description
      1   |USER                          |User Remote control causing action on actuator
      2   |RAIN                          |Rain sensor
      3   |TIMER                         |Timer controlled
      5   |UPS                           |UPS unit
      8   |SAAC                          |Stand Alone Automatic Controls
      9   |WIND                          |Wind sensor
      11  |LOAD_SHEDDING                 |Managers for requiring a particular electric load shed.
      12  |LOCAL_LIGHT                   |Local light sensor.
      13  |UNSPECIFIC_ENVIRONMENT_SENSOR |Used in context with commands transmitted on basis of an unknown sensor for protection of an end-product or house goods.
      255 |EMERGENCY                     |Used in context with emergency or security commands

    PriorityLevel parameter
    Level      |Number |Class           |Description
    Protection |0      |Human           |Provide the most secured level.
               |       |Protection      |Since consequences of misusing this level can deeply impact the
               |       |                |system behaviour, and therefore the io-homecontrol image, it
               |       |                |is mandatory for the manufacturer that wants to use this level
               |       |                |of priority to receive an agreement from io-homecontrol®
               |       |                |In any case the reception of such a command will disable all
               |       |                |categories (Level 0 to 7).
               |1      |Environment     |Used by local sensors that are relative to goods protection: endproduct
               |       |Protection      |protection, house goods protection.
               |       |                |Examples: wind sensor on a terrace awning, rain sensor on a roof window, etc.
    User       |2      |User Level 1    |Used by controller to send one (or a set of one shot) immediate
               |       |                |action commands when user manually requested for this.
               |       |                |Controllers prescribed as having a higher level of priority than
               |       |                |others use this level.
               |       |                |For example, this level can be used in combination with a lock
               |       |                |command on other levels of priority, for providing an exclusive
               |       |                |access to actuators control. e.g Parents/Children different
               |       |                |access rights, …
               |3      |User Level 2    |Used by controller to send one (or a set of one shot) immediate
               |       |                |action commands when user manually requested for this.
               |       |                |This level is the default level used by controllers.
    Comfort    |4      |Comfort Level 1 |TBD. Don’t use
               |5      |Comfort Level 2 |Used by Stand Alone Automatic Controls
               |6      |Comfort Level 3 |TBD. Don’t use
               |7      |Comfort Level 4 |TBD. Don’t use


    -in
    json data
    {
      *sessionID: [optional int],
      commandOriginator: [int],
      priorityLevel: [int],
      sceneID: [int],
      velocity: [int]
    }

    - out
    buffer
  */
  GW_ACTIVATE_SCENE_REQ:  function (data) {
    var buf = new Buffer(1)
    buf.writeUInt16BE(Tools.getSessionID(data.sessionID),0)
    buf.writeUInt8(data.commandOriginator,2)
    buf.writeUInt8(data.priorityLevel,3)
    buf.writeUInt8(data.sceneID,4)
    buf.writeUInt8(data.velocity,5)
    return buf
  },


  /*
    Command           |Data 1 – 2 |Data 3            |Data 4        |Data 5
    GW_STOP_SCENE_REQ |SessionID  |CommandOriginator |PriorityLevel |SceneID

    CommandOriginator
    value |Tag                           |Description
      1   |USER                          |User Remote control causing action on actuator
      2   |RAIN                          |Rain sensor
      3   |TIMER                         |Timer controlled
      5   |UPS                           |UPS unit
      8   |SAAC                          |Stand Alone Automatic Controls
      9   |WIND                          |Wind sensor
      11  |LOAD_SHEDDING                 |Managers for requiring a particular electric load shed.
      12  |LOCAL_LIGHT                   |Local light sensor.
      13  |UNSPECIFIC_ENVIRONMENT_SENSOR |Used in context with commands transmitted on basis of an unknown sensor for protection of an end-product or house goods.
      255 |EMERGENCY                     |Used in context with emergency or security commands

    PriorityLevel parameter
    Level      |Number |Class           |Description
    Protection |0      |Human           |Provide the most secured level.
               |       |Protection      |Since consequences of misusing this level can deeply impact the
               |       |                |system behaviour, and therefore the io-homecontrol image, it
               |       |                |is mandatory for the manufacturer that wants to use this level
               |       |                |of priority to receive an agreement from io-homecontrol®
               |       |                |In any case the reception of such a command will disable all
               |       |                |categories (Level 0 to 7).
               |1      |Environment     |Used by local sensors that are relative to goods protection: endproduct
               |       |Protection      |protection, house goods protection.
               |       |                |Examples: wind sensor on a terrace awning, rain sensor on a roof window, etc.
    User       |2      |User Level 1    |Used by controller to send one (or a set of one shot) immediate
               |       |                |action commands when user manually requested for this.
               |       |                |Controllers prescribed as having a higher level of priority than
               |       |                |others use this level.
               |       |                |For example, this level can be used in combination with a lock
               |       |                |command on other levels of priority, for providing an exclusive
               |       |                |access to actuators control. e.g Parents/Children different
               |       |                |access rights, …
               |3      |User Level 2    |Used by controller to send one (or a set of one shot) immediate
               |       |                |action commands when user manually requested for this.
               |       |                |This level is the default level used by controllers.
    Comfort    |4      |Comfort Level 1 |TBD. Don’t use
               |5      |Comfort Level 2 |Used by Stand Alone Automatic Controls
               |6      |Comfort Level 3 |TBD. Don’t use
               |7      |Comfort Level 4 |TBD. Don’t use

    -in
    json data
    {
      *sessionID: [optional int],
      commandOriginator: [int],
      priorityLevel: [int],
      sceneID: [int]
    }

    - out
    buffer
  */
  GW_STOP_SCENE_REQ:  function (data) {
    var buf = new Buffer(1)
    buf.writeUInt16BE(Tools.getSessionID(data.sessionID),0)
    buf.writeUInt8(data.commandOriginator,2)
    buf.writeUInt8(data.priorityLevel,3)
    buf.writeUInt8(data.sceneID,4)
    return buf
  },



  /*
    Command                      |Data 1 - 2 |Data 3            |Data 4        |Data 5
    GW_ACTIVATE_PRODUCTGROUP_REQ |SessionID  |CommandOriginator |PriorityLevel |ProductGroupID

    Data 6      |Data 7 - 8 |Data 9   |Data 10           |Data 11 |Data 12 |Data 13
    ParameterID |Position   |Velocity |PriorityLevelLock |PL_0_3  |PL_4_7  |LockTime

    CommandOriginator
    value |Tag                           |Description
      1   |USER                          |User Remote control causing action on actuator
      2   |RAIN                          |Rain sensor
      3   |TIMER                         |Timer controlled
      5   |UPS                           |UPS unit
      8   |SAAC                          |Stand Alone Automatic Controls
      9   |WIND                          |Wind sensor
      11  |LOAD_SHEDDING                 |Managers for requiring a particular electric load shed.
      12  |LOCAL_LIGHT                   |Local light sensor.
      13  |UNSPECIFIC_ENVIRONMENT_SENSOR |Used in context with commands transmitted on basis of an unknown sensor for protection of an end-product or house goods.
      255 |EMERGENCY                     |Used in context with emergency or security commands

    PriorityLevel parameter
    Level      |Number |Class           |Description
    Protection |0      |Human           |Provide the most secured level.
               |       |Protection      |Since consequences of misusing this level can deeply impact the
               |       |                |system behaviour, and therefore the io-homecontrol image, it
               |       |                |is mandatory for the manufacturer that wants to use this level
               |       |                |of priority to receive an agreement from io-homecontrol®
               |       |                |In any case the reception of such a command will disable all
               |       |                |categories (Level 0 to 7).
               |1      |Environment     |Used by local sensors that are relative to goods protection: endproduct
               |       |Protection      |protection, house goods protection.
               |       |                |Examples: wind sensor on a terrace awning, rain sensor on a roof window, etc.
    User       |2      |User Level 1    |Used by controller to send one (or a set of one shot) immediate
               |       |                |action commands when user manually requested for this.
               |       |                |Controllers prescribed as having a higher level of priority than
               |       |                |others use this level.
               |       |                |For example, this level can be used in combination with a lock
               |       |                |command on other levels of priority, for providing an exclusive
               |       |                |access to actuators control. e.g Parents/Children different
               |       |                |access rights, …
               |3      |User Level 2    |Used by controller to send one (or a set of one shot) immediate
               |       |                |action commands when user manually requested for this.
               |       |                |This level is the default level used by controllers.
    Comfort    |4      |Comfort Level 1 |TBD. Don’t use
               |5      |Comfort Level 2 |Used by Stand Alone Automatic Controls
               |6      |Comfort Level 3 |TBD. Don’t use
               |7      |Comfort Level 4 |TBD. Don’t use

    ParameterID
    value |Tag  |Description
      0   |MP   |Main Parameter.
      1   |FP1  |Functional Parameter number 1.
      2   |FP2  |Functional Parameter number 2.
      3   |FP3  |Functional Parameter number 3.
      4   |FP4  |Functional Parameter number 4.
      5   |FP5  |Functional Parameter number 5.
      6   |FP6  |Functional Parameter number 6.
      7   |FP7  |Functional Parameter number 7.
      8   |FP8  |Functional Parameter number 8.
      9   |FP9  |Functional Parameter number 9.
      10  |FP10 |Functional Parameter number 10.
      11  |FP11 |Functional Parameter number 11.
      12  |FP12 |Functional Parameter number 12.
      13  |FP13 |Functional Parameter number 13.
      14  |FP14 |Functional Parameter number 14.
      15  |FP15 |Functional Parameter number 15.
      16  |FP16 |Functional Parameter number 16.

    PriorityLevelLock
    value |Description
      0   |Do not set a new lock on priority level. Information in the parameters PL_0_3, PL_4_7
          |and LockTime are not used. This is the one typically used.
      1   |Information in the parameters PL_0_3, PL_4_7 and LockTime are used to lock one or
          |more priority level.


    PLI information
    Value |Name             |Description
      0   |Disable priority |Disable the priority related to the Master
      1   |Enable           |Enable the priority related to the Master
      2   |Enable all       |Enable all pool entry for the specified priority level
          |                 |Must be used with caution!
      3   |Keep current     |Do not make any action. When used, the priority setting
          |                 |for the specific level will be kept in its current state.



    LockTime ((value+1)*30)
    value  |Description
      0    |30 seconds
      1    |60 seconds
      :    |    :
     254   |7650 seconds
           |(127 min 30 sec)
     255   |Unlimited time

    -in
    json data
    {
      *sessionID: [optional int],
      commandOriginator: [int],
      priorityLevel: [int],
      productGroupID: [int],
      parameterID: [int],
      position: [int/value],
      velocity: [int],
      priorityLevelLock: [bool],
      priorityLevel_0_7: [array[8] of int],
      lockTime: [int]
    }

    -out
    buffer

    -subtype
    json value {
      value: [fload],
      valueType: [string],
      rawValue: [int]
    }

  */
  GW_ACTIVATE_PRODUCTGROUP_REQ:  function (data) {
    var buf = new Buffer(66)
    buf.fill(0)
    buf.writeUInt16BE(Tools.getSessionID(data.sessionID),0)
    buf.writeUInt8(data.commandOriginator,2)
    buf.writeUInt8(data.priorityLevel,3)
    buf.writeUInt8(data.productGroupID,4)
    buf.writeUInt8(data.parameterID,5)
    buf.writeUInt16BE(Tools.calcPosition(data.position),6)
    buf.writeUInt8(data.velocity,8)
    buf.writeUInt8(data.priorityLevelLock,9)
    if (data.priorityLevelLock) {
      var priorityLevel_0_7 = ((data.priorityLevel_0_7[0]&0x3)<<6)+
                          ((data.priorityLevel_0_7[1]&0x3)<<4)+
                          ((data.priorityLevel_0_7[2]&0x3)<<2)+
                          ((data.priorityLevel_0_7[3]&0x3))
      buf.writeUInt8(priorityLevel_0_7,10)
      var priorityLevel_0_7 = ((data.priorityLevel_0_7[4]&0x3)<<6)+
                          ((data.priorityLevel_0_7[5]&0x3)<<4)+
                          ((data.priorityLevel_0_7[6]&0x3)<<2)+
                          ((data.priorityLevel_0_7[7]&0x3))
      buf.writeUInt8(priorityLevel_0_7,11)
    }
    buf.writeUInt8(data.lockTime,12)

    return buf
  },


  /*
    Command
    GW_GET_CONTACT_INPUT_LINK_LIST_REQ

    -in
    json data
    {
    }

    -out
    null
  */
  GW_GET_CONTACT_INPUT_LINK_LIST_REQ:  function (data) {
    //var buf = new Buffer(1)
    //return buf
    return null
  },


  /*
    Command                       |Data 1         |Data 2                 |Data 3
    GW_SET_CONTACT_INPUT_LINK_REQ |ContactInputID |ContactInputAssignment |ActionID

    Date 4            |Data 5        |Data 6      |Data 7 - 8 |Data 9   |Data 10
    CommandOriginator |PriorityLevel |ParameterID |Position   |Velocity |LockPriorityLevel

    Data 11 |Data 12 |Data 13 |Data 14 |Data 15 |Data 16         |Data 17
    PLI_3   |PLI_4   |PLI_5   |PLI_6   |PLI_7   |SuccessOutputID |ErrorOutputID

    PriorityLevel parameter
    Level      |Number |Class           |Description
    Protection |0      |Human           |Provide the most secured level.
               |       |Protection      |Since consequences of misusing this level can deeply impact the
               |       |                |system behaviour, and therefore the io-homecontrol image, it
               |       |                |is mandatory for the manufacturer that wants to use this level
               |       |                |of priority to receive an agreement from io-homecontrol®
               |       |                |In any case the reception of such a command will disable all
               |       |                |categories (Level 0 to 7).
               |1      |Environment     |Used by local sensors that are relative to goods protection: endproduct
               |       |Protection      |protection, house goods protection.
               |       |                |Examples: wind sensor on a terrace awning, rain sensor on a roof window, etc.
    User       |2      |User Level 1    |Used by controller to send one (or a set of one shot) immediate
               |       |                |action commands when user manually requested for this.
               |       |                |Controllers prescribed as having a higher level of priority than
               |       |                |others use this level.
               |       |                |For example, this level can be used in combination with a lock
               |       |                |command on other levels of priority, for providing an exclusive
               |       |                |access to actuators control. e.g Parents/Children different
               |       |                |access rights, …
               |3      |User Level 2    |Used by controller to send one (or a set of one shot) immediate
               |       |                |action commands when user manually requested for this.
               |       |                |This level is the default level used by controllers.
    Comfort    |4      |Comfort Level 1 |TBD. Don’t use
               |5      |Comfort Level 2 |Used by Stand Alone Automatic Controls
               |6      |Comfort Level 3 |TBD. Don’t use
               |7      |Comfort Level 4 |TBD. Don’t use

    -in
    json data
    {
      contactInputID: [int],
      contactInputAssignment: [int],
      actionID: [int],
      commandOriginator: [int],
      priorityLevel: [int],
      parameterID: [int],
      position: [type of position]
      velocity: [int],
      lockPriorityLevel: [int],
      pLI_3: [int],
      pLI_4: [int],
      pLI_5: [int],
      pLI_6: [int],
      pLI_7: [int],
      successOutputID: [int],
      errorOutputID: [int]
    }

    -out
    buf
  */
  GW_SET_CONTACT_INPUT_LINK_REQ:  function (data) {
    var buf = new Buffer(17)
    buf.writeUInt8(data.contactInputID,0)
    buf.writeUInt8(data.contactInputAssignment,1)
    buf.writeUInt8(data.actionID,2)
    buf.writeUInt8(data.commandOriginator,3)
    buf.writeUInt8(data.priorityLevel,4)
    buf.writeUInt8(data.parameterID,5)
    buf.writeUInt16BE(tools.calcPosition(data.position),6)
    buf.writeUInt8(data.velocity,8)
    buf.writeUInt8(data.lockPriorityLevel,9)
    buf.writeUInt8(data.pLI_3,10)
    buf.writeUInt8(data.pLI_4,11)
    buf.writeUInt8(data.pLI_5,12)
    buf.writeUInt8(data.pLI_6,13)
    buf.writeUInt8(data.pLI_7,14)
    buf.writeUInt8(data.successOutputID,15)
    buf.writeUInt8(data.errorOutputID,16)
    return buf
  },


  /*
    Command                          |Data 1
    GW_REMOVE_CONTACT_INPUT_LINK_REQ |ContactInputID

    -in
    json data
    {
      contactInputID: [int]
    }

    -out
    buf
  */
  GW_REMOVE_CONTACT_INPUT_LINK_REQ:  function (data) {
    var buf = new Buffer(1)
    buf.writeUInt8(data.contactInputID,0)
    return buf
  },



  /*
    Command
    GW_GET_ACTIVATION_LOG_HEADER_REQ

    -in
    json data
    {
    }

    -out
    null
  */
  GW_GET_ACTIVATION_LOG_HEADER_REQ:  function (data) {
    //var buf = new Buffer(1)
    //return buf
    return null
  },


  /*
    Command
    GW_CLEAR_ACTIVATION_LOG_REQ

    -in
    json data
    {
    }

    -out
    null
  */
  GW_CLEAR_ACTIVATION_LOG_REQ:  function (data) {
    //var buf = new Buffer(1)
    //return buf
    return null
  },


  /*
    Command                        |Data 1-2
    GW_GET_ACTIVATION_LOG_LINE_REQ |Line

    -in
    json data
    {
      line: [int]
    }

    -out
    buf
  */
  GW_GET_ACTIVATION_LOG_LINE_REQ:  function (data) {
    var buf = new Buffer(2)
    buf.writeUInt16BE(data.line,0)
    return buf
  },


  /*
    Command                                  |Data 1-4
    GW_GET_MULTIPLE_ACTIVATION_LOG_LINES_REQ |TimeStamp

    -in
    json data
    {
    }

    -out
    null
  */
  GW_GET_MULTIPLE_ACTIVATION_LOG_LINES_REQ:  function (data) {
    //var buf = new Buffer(1)
    //return buf
    return null
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
      utcTimeStamp = Tools.localToUtcTimestamp(new Date(data.localTimeStamp))
    } else {
      utcTimeStamp = new Date(data.utcTimeStamp)
    }
    console.log(utcTimeStamp)
    buf.writeUInt32BE( utcTimeStamp.getTime()  / 1000, 0)
    return buf
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
    Command
    GW_GET_LOCAL_TIME_REQ

    -in
    json data
    {
    }

    -out
    null
  */
  GW_GET_LOCAL_TIME_REQ:  function (data) {
    return null
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
  }
}
exports.APIFunctionOUT = APIFunctionOUT

const APIFunctionIN = {
  /*
  Command      |Data 1
  GW_ERROR_NTF |ErrorNumber

    -in
    buffer

    - out
      json data
      {
        errorNumber: [Number],
        error: [string]
      }
  */
  GW_ERROR_NTF:  function (buf) {
    var data = {}
    data.errorNumber = buf.readUInt8(0)
    data.error = ErrorNumber[data.errorNumber]
    return data
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
      softwareVersion: [array 6 of int],
      hardwareVersion: [int],
      productGroup: [int],
      productType: [int]
    }
  */
  GW_GET_VERSION_CFM:  function (buf) {
    var data = {}
    data.softwareVersion = [buf.readUInt8(0),buf.readUInt8(1),buf.readUInt8(2),buf.readUInt8(3),buf.readUInt8(4),buf.readUInt8(5)]
    data.hardwareVersion = buf.readUInt8(6)
    data.productGroup = buf.readUInt8(7)
    data.productType = buf.readUInt8(8)
    return data
  },


  /*
    Command                     |Data 1-2     |Data 3-4
    GW_GET_PROTOCOL_VERSION_CFM |MajorVersion |MinorVersion

    -in
    buffer

    -out
    json data
    {
      majorVersion: [int],
      minorVersion: [int]
    }
  */
  GW_GET_PROTOCOL_VERSION_CFM:  function (buf) {
    var data = {}
    data.majorVersion = buf.readUInt16BE(0)
    data.minorVersion = buf.readUInt16BE(2)
    return data
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
      gatewayState: [int],
      subState: [int]
      StateData: [array of 4 int]
    }
  */
  GW_GET_STATE_CFM:  function (buf) {
    var data = {}
    data.gatewayState = buf.readUInt8(0)
    data.subState = buf.readUInt8(1)
    data.stateData = [buf.readUInt8(2),buf.readUInt8(3),buf.readUInt8(4),buf.readUInt8(5)]
    return data
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
      actuator.actuatorTypeText = ActuatorType[actuator.actuatorType]
      actuator.actuatorSubType = at&0x3F
      var mode = buf.readUInt8(index++)
      actuator.powerSaveMode = mode&0x03
      actuator.powerSaveModeText = PowerSaveMode[actuator.powerSaveMode]
      actuator.ioMembership = ((mode&0x04) != 0)
      actuator.rfSupport = ((mode&0x08) != 0)
      actuator.actuatorTurnaroundTime = mode>>6
      actuator.actuatorTurnaroundTimeText = ActuatorTurnaroundTime[actuator.actuatorTurnaroundTime]
      actuator.ioManufacturerId = buf.readUInt8(index++)
      actuator.ioManufacturerIdText = IOManufacturerId[actuator.ioManufacturerId]
      actuator.backboneReferenceNumber={HighestByte: buf.readUInt8(index++),
                                        MiddleByte: buf.readUInt8(index++),
                                        LowestByte: buf.readUInt8(index++)}
      data.actuator[i] = actuator
    }
    return data
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
    data.addedNodes={actuator:Tools.getActuator(buf,0),beacon:Tools.getBeacon(buf,25)}
    data.rfConnectionError={actuator:Tools.getActuator(buf,26),beacon:Tools.getBeacon(buf,51)}
    data.ioKeyErrorExistingNode={actuator:Tools.getActuator(buf,52),beacon:Tools.getBeacon(buf,77)}
    data.removed ={actuator:Tools.getActuator(buf,78),beacon:Tools.getBeacon(buf,103)}
    data.open ={actuator:Tools.getActuator(buf,104),beacon:Tools.getBeacon(buf,129)}
    data.discoverStatus = buf.readUInt8(130)
    data.discoverStatusText = DiscoverStatus[data.dscoverStatus]
    return data
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
    data.controllerCopyModeText = ControllerCopyMode[+data.controllerCopyMode]
    data.controllerCopyStatus = buf.readUInt8(1)
    if (data.controllerCopyMode==0) {
      data.controllerCopyStatusText = ControllerCopyStatusTCM[data.controllerCopyStatus]
    } else {
      data.controllerCopyStatusText = ControllerCopyStatusRCM[data.controllerCopyStatus]
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
    Command
    GW_CS_RECEIVE_KEY_CFM

    -in
    buffer

    - out
    json data
    {
    }
  */
  GW_CS_RECEIVE_KEY_CFM:  function (buf) {
    var data = {}
    return data
  },


  /*
    Command               |Data 1          |Data 2 - 27 |Data 28 - 53
    GW_CS_RECEIVE_KEY_NTF |ChangeKeyStatus |KeyChanged  |KeyNotChanged

    -in
    buffer

    - out
    json data
    {
      changeKeyStatus : [int]
      changeKeyStatusText : [string]
      keyChanged: [buffer(26)]
      keyNotChanged : [buffer(26)]
    }
  */
  GW_CS_RECEIVE_KEY_NTF:  function (buf) {
    var data = {}
    data.changeKeyStatus = buf.readInt8(0)
    data.changeKeyStatusText = ChangeKeyStatus[data.changeKeyStatus]
    data.keyChanged = buf.slice(1,27).toString('hex')
    data.keyNotChanged = buf.slice(27,53).toString('hex')
    return data
  },


  /*
    Command           |Data 1      |Data 2       |Data 3
    GW_CS_PGC_JOB_NTF |PgcJobState |PgcJobStatus |PgcJobType

    -in
    buffer

    - out
    json data
    {
      pgcJobState : [int],
      pgcJobStateText : [string],
      pgcJobStatus : [int],
      pgcJobStatusText : [string],
      pgcJobType : [int],
      pgcJobTypeText : [string],
      pgcJobTypeInitiatedBy : [string]
    }
  */
  GW_CS_PGC_JOB_NTF:  function (buf) {
    var data = {}
    pgcJobState = buf.readInt8(0)
    pgcJobStateText = PgcJobState[pgcJobState]
    pgcJobStatus = buf.readInt8(1)
    pgcJobStatusText = PgcJobStatus[pgcJobStatus]
    pgcJobType = buf.readInt8(2)
    pgcJobTypeText = PgcJobTypeDescription[pgcJobType]
    pgcJobTypeInitiatedBy = PgcJobTypeInitiatedBy[pgcJobType]
    return data
  },


  /*
    Command                       |Data 1-26          |Data 27-52
    GW_CS_SYSTEM_TABLE_UPDATE_NTF |AddedNodesBitArray |RemovedNodesBitArray

    -in
    buffer

    - out
    json data
    {
      addedNodes: {json type},
      removedNodes: {json type},
    }

    -subtypes
    jason type
    {
      actuator [array 200 of int]
      beacon [array 3 of int]
    }
  */
  GW_CS_SYSTEM_TABLE_UPDATE_NTF:  function (buf) {
    var data = {}
    data.addedNodes={actuator:Tools.getActuator(buf,0),beacon:Tools.getBeacon(buf,25)}
    data.removedNodes={actuator:Tools.getActuator(buf,26),beacon:Tools.getBeacon(buf,51)}
    return data
  },


  /*
    Command
    GW_CS_GENERATE_NEW_KEY_CFM
    -in
    buffer

    - out
    json data
    {
    }
  */
  GW_CS_GENERATE_NEW_KEY_CFM:  function (buf) {
    var data = {}
    return data
  },


  /*
    Command                    |Data 1          |Data 2 - 27 |Data 28 - 53
    GW_CS_GENERATE_NEW_KEY_NTF |ChangeKeyStatus |KeyChanged  |KeyNotChanged

    -in
    buffer

    - out
    json data
    {
      changeKeyStatus : [int]
      changeKeyStatusText : [string]
      keyChanged: [string]
      keyNotChanged : [string]
    }
  */
  GW_CS_GENERATE_NEW_KEY_NTF:  function (buf) {
    var data = {}
    data.changeKeyStatus = buf.readInt8(0)
    data.changeKeyStatusText = ChangeKeyStatus[data.changeKeyStatus]
    data.keyChanged = buf.slice(1,27).toString('hex')
    data.keyNotChanged = buf.slice(27,53).toString('hex')
    return data
  },


  /*
    Command
    GW_CS_REPAIR_KEY_CFM
    -in
    buffer

    - out
    json data
    {
    }
  */
  GW_CS_REPAIR_KEY_CFM:  function (buf) {
    var data = {}
    return data
  },


  /*
    Command              |Data 1          |Data 2 - 27 |Data 28 - 53
    GW_CS_REPAIR_KEY_NTF |ChangeKeyStatus |KeyChanged  |KeyNotChanged

    -in
    buffer

    - out
    json data
    {
      changeKeyStatus : [int]
      changeKeyStatusText : [string]
      keyChanged: [buffer(26)]
      keyNotChanged : [buffer(26)]
    }
  */
  GW_CS_REPAIR_KEY_NTF:  function (buf) {
    var data = {}
    data.changeKeyStatus = buf.readInt8(0)
    data.changeKeyStatusText = ChangeKeyStatus[data.changeKeyStatus]
    data.keyChanged = buf.slice(1,27).toString('hex')
    data.keyNotChanged = buf.slice(27,53).toString('hex')
    return data
  },


  /*
    Command                               |Data 1 – 26 |Data 27 – 52 |Data 53 – 78 |Data 79
    GW_CS_ACTIVATE_CONFIGURATION_MODE_CFM |Activated   |NoContact    |OtherError   |Status

    -in
    buffer

    - out
    json data
    {
      activated: {json type},
      noContact: {json type},
      otherError: {json type},
      status: [int]
    }

    -subtypes
    jason type
    {
      actuator [array 200 of int]
      beacon [array 3 of int]
    }
  */
  GW_CS_ACTIVATE_CONFIGURATION_MODE_CFM:  function (buf) {
    var data = {}
    data.activated={actuator:Tools.getActuator(buf,0),beacon:Tools.getBeacon(buf,25)}
    data.noContact={actuator:Tools.getActuator(buf,26),beacon:Tools.getBeacon(buf,51)}
    data.otherError={actuator:Tools.getActuator(buf,52),beacon:Tools.getBeacon(buf,77)}
    data.status = bud.readInt8(78)
    return data
  },


  /*
    Command                     |Data 1 |Data 2
    GW_GET_NODE_INFORMATION_CFM |Status |NodeID

    -in
    buffer

    - out
    json data
    {
      status: [int],
      statusText: [string],
      nodeID: [int]
    }
  */
  GW_GET_NODE_INFORMATION_CFM:  function (buf) {
    var data = {}
    data.status = buf.readUInt8(0)
    data.statusText = NodeInformationStatus[data.status]
    data.nodeID = buf.readUInt8(1)
    return data
  },


  /*
    Command                     |Data 1 |Data 2 - 3 |Data 4    |Data 5 - 68 |Data 69
    GW_GET_NODE_INFORMATION_NTF |NodeID |Order      |Placement |Name        |Velocity

    Data 70 - 71    |Data 72      |Data 73     |Data 74       |Data 75   |Data 76
    NodeTypeSubType |ProductGroup |ProductType |NodeVariation |PowerMode |BuildNumber

    Data 77 - 84 |Data 85 |Data 86 - 87    |Data 88 - 89 |Data 90 - 91       |Data 92 - 93
    SerialNumber |State   |CurrentPosition |Target       |FP1CurrentPosition |FP2CurrentPosition

    Data 94 - 95       |Data 96 - 97       |Data 98 - 99  |Data 100 - 103 |Data 104   |Data 105 - 125
    FP3CurrentPosition |FP4CurrentPosition |RemainingTime |TimeStamp      |NbrOfAlias |AliasArray

    -in
    buffer

    - out
    json data
    {
      nodeID : [int],
      order : [int],
      placement : [int],
      nodeName : [string],
      velocity : [int],
      velocityTag : [string],
      velocityText : [string],
      nodeTypeSubType : [int],
      productGroup : [int],
      productType : [int],
      nodeVariation : [int],
      nodeVariationTag : [string],
      nodeVariationText : [string],
      powerMode : [int],
      powerModeText : [string],
      buildNumber : [int],
      serialNumber : [int],
      state : [int],
      stateTag : [String],
      stateText : [String],
      currentPosition : [value],
      target : [value],
      fp1CurrentPosition : [value],
      fp2CurrentPosition : [value],
      fp3CurrentPosition : [value],
      fp4CurrentPosition : [value],
      remainingTime : [int],
      timeStamp : [int],
      utcTimeStamp : [date],
      nbrOfAlias : [int],
      aliasArray : [array of alias]

    }

    - subtype
    json alias {
      type : [int],
      value : [int]
    }
    json value {
      value: [fload],
      valueType: [string],
      rawValue: [int]
    }
  */
  GW_GET_NODE_INFORMATION_NTF:  function (buf) {
    var data = {}
    data.nodeID = buf.readUInt8(0)
    data.order = buf.readUInt16BE(1)
    data.placement = buf.readUInt8(3)
    data.nodeName = Tools.getString(buf,4,64,'utf8')
    data.velocity = buf.readUInt8(68)
    data.velocityTag = Tools.nameFromId(data.velocity,VelocityTag)
    data.velocityText = VelocityDescription[data.velocityTag]
    data.nodeTypeSubType = buf.readUInt16BE(69)
    data.productGroup = buf.readInt8(71)
    data.productType = buf.readInt8(72)
    data.nodeVariation = buf.readUInt8(73)
    data.nodeVariationTag = Tools.nameFromId(data.nodeVariation,NodeVariationTag)
    data.nodeVariationText = NodeVariationDescription[data.nodeVariationTag]
    data.powerMode = buf.readUInt8(74)
    data.powerModeText = PowerSaveMode[data.powerMode]
    data.buildNumber = buf.readUInt8(75)
    data.serialNumber = buf.slice(76,84).toString('hex')
    data.state = buf.readUInt8(84)
    data.stateTag = OperatingStateTag[data.state]
    data.stateText = OperatingStateDescription[data.state]
    data.currentPosition = Tools.getPosition(buf.readUInt16BE(85))
    data.target = Tools.getPosition(buf.readUInt16BE(87))
    data.fp1CurrentPosition = Tools.getPosition(buf.readUInt16BE(89))
    data.fp2CurrentPosition = Tools.getPosition(buf.readUInt16BE(91))
    data.fp3CurrentPosition = Tools.getPosition(buf.readUInt16BE(93))
    data.fp4CurrentPosition = Tools.getPosition(buf.readUInt16BE(95))
    data.remainingTime = buf.readUInt16BE(97)
    data.timeStamp = buf.readInt32BE(99)
    data.utcTimeStamp = new Date(data.timeStamp*1000)
    data.nbrOfAlias = buf.readUInt8(103)
    data.aliasArray = []
    var index = 104
    for (var i=0;i<data.nbrOfAlias-1&&i<5; i++) {
      var alias={}
      alias.type = buf.readUInt16BE(index)
      index+=2
      alias.value = buf.readUInt16BE(index)
      index+=2
      data.aliasArray[i] = alias
    }
    return data
  },


  /*
    Command                          |Data 1 |Data 2
    GW_GET_ALL_NODES_INFORMATION_CFM |Status |TotalNumberOfNodes

    -in
    buffer

    - out
    json data
    {
      status: [boolean]
      totalNumberOfNodes: [int]
    }
  */
  GW_GET_ALL_NODES_INFORMATION_CFM:  function (buf) {
    var data = {}
    data.status = !(!(buf.readUInt8(0)==0))
    data.totalNumberOfNodes = buf.readUInt8(1)
    return data
  },


  /*
    Command                          |Data 1 |Data 2 - 3 |Data 4    |Data 5 - 68 |Data 69
    GW_GET_ALL_NODES_INFORMATION_NTF |NodeID |Order      |Placement |Name        |Velocity

    Data 70 - 71    |Data 72      |Data 73     |Data 74       |Data 75   |Data 76
    NodeTypeSubType |ProductGroup |ProductType |NodeVariation |PowerMode |BuildNumber

    Data 77 - 84 |Data 85 |Data 86 - 87    |Data 88 - 89 |Data 90 - 91       |Data 92 - 93
    SerialNumber |State   |CurrentPosition |Target       |FP1CurrentPosition |FP2CurrentPosition

    Data 94 - 95       |Data 96 - 97       |Data 98 - 99  |Data 100 - 103 |Data 104   |Data 105 - 125
    FP3CurrentPosition |FP4CurrentPosition |RemainingTime |TimeStamp      |NbrOfAlias |AliasArray

    -in
    buffer

    - out
    json data
    {
      nodeID : [int],
      order : [int],
      placement : [int],
      nodeName : [string],
      velocity : [int],
      velocityTag : [string],
      velocityText : [string],
      nodeTypeSubType : [int],
      productGroup : [int],
      productType : [int],
      nodeVariation : [int],
      nodeVariationTag : [string],
      nodeVariationText : [string],
      powerMode : [int],
      powerModeText : [string],
      buildNumber : [int],
      serialNumber : [int],
      state : [int],
      stateTag : [String],
      stateText : [String],
      currentPosition : [value],
      target : [value],
      fp1CurrentPosition : [value],
      fp2CurrentPosition : [value],
      fp3CurrentPosition : [value],
      fp4CurrentPosition : [value],
      remainingTime : [int],
      timeStamp : [int],
      utcTimeStamp : [date],
      nbrOfAlias : [int],
      aliasArray : [array of alias]

    }

    - subtype
    json alias {
      type : [int],
      value : [int]
    }
    json value {
      value: [fload],
      valueType: [string],
      rawValue: [int]
    }
  */
  GW_GET_ALL_NODES_INFORMATION_NTF:  function (buf) {
    var data = {}
    data.nodeID = buf.readUInt8(0)
    data.order = buf.readUInt16BE(1)
    data.placement = buf.readUInt8(3)
    data.nodeName = Tools.getString(buf,4,64,'utf8')
    data.velocity = buf.readUInt8(68)
    data.velocityTag = Tools.nameFromId(data.velocity,VelocityTag)
    data.velocityText = VelocityDescription[data.velocityTag]
    data.nodeTypeSubType = buf.readUInt16BE(69)
    data.productGroup = buf.readInt8(71)
    data.productType = buf.readInt8(72)
    data.nodeVariation = buf.readUInt8(73)
    data.nodeVariationTag = Tools.nameFromId(data.nodeVariation,NodeVariationTag)
    data.nodeVariationText = NodeVariationDescription[data.nodeVariationTag]
    data.powerMode = buf.readUInt8(74)
    data.powerModeText = PowerSaveMode[data.powerMode]
    data.buildNumber = buf.readUInt8(75)
    data.serialNumber = buf.slice(76,84).toString('hex')
    data.state = buf.readUInt8(84)
    data.stateTag = OperatingStateTag[data.state]
    data.stateText = OperatingStateDescription[data.state]
    data.currentPosition = Tools.getPosition(buf.readUInt16BE(85))
    data.target = Tools.getPosition(buf.readUInt16BE(87))
    data.fp1CurrentPosition = Tools.getPosition(buf.readUInt16BE(89))
    data.fp2CurrentPosition = Tools.getPosition(buf.readUInt16BE(91))
    data.fp3CurrentPosition = Tools.getPosition(buf.readUInt16BE(93))
    data.fp4CurrentPosition = Tools.getPosition(buf.readUInt16BE(95))
    data.remainingTime = buf.readUInt16BE(97)
    data.timeStamp = buf.readInt32BE(99)
    data.utcTimeStamp = new Date(data.timeStamp*1000)
    data.nbrOfAlias = buf.readUInt8(103)
    data.aliasArray = []
    var index = 104
    for (var i=0;i<data.nbrOfAlias-1&&i<5; i++) {
      var alias={}
      alias.type = buf.readUInt16BE(index)
      index+=2
      alias.value = buf.readUInt16BE(index)
      index+=2
      data.aliasArray[i] = alias
    }
    return data
  },


  /*
    Command
    GW_GET_ALL_NODES_INFORMATION_FINISHED_NTF

    -in
    buffer

    - out
    json data
    {
    }
  */
  GW_GET_ALL_NODES_INFORMATION_FINISHED_NTF:  function (buf) {
    var data = {}
    return data
  },


  /*
    Command                   |Data 1 |Data 2
    GW_SET_NODE_VARIATION_CFM |Status |NodeID

      -in
    buffer

    - out
    json data
    {
      status: [int],
      statusText: [string],
      nodeID: [int]
    }
  */
  GW_SET_NODE_VARIATION_CFM:  function (buf) {
    var data = {}
    data.status = buf.readUInt8(0)
    data.statusText = NodeInformationStatus[data.status]
    data.nodeID = buf.readUInt8(1)
    return data
  },


  /*
    Command              |Data 1 |Data 2
    GW_SET_NODE_NAME_CFM |Status |NodeID

      -in
    buffer

    - out
    json data
    {
      status: [int],
      statusText: [string],
      nodeID: [int]
    }
  */
  GW_SET_NODE_NAME_CFM:  function (buf) {
    var data = {}
    data.status = buf.readUInt8(0)
    data.statusText = NodeInformationStatus[data.status]
    data.nodeID = buf.readUInt8(1)
    return data
  },


  /*
    Command                  |Data 1 |Data 2
    GW_SET_NODE_VELOCITY_CFM |Status |NodeID

      -in
    buffer

    - out
    json data
    {
      status: [int],
      statusText: [string],
      nodeID: [int]
    }
  */
  GW_SET_NODE_VELOCITY_CFM:  function (buf) {
    var data = {}
    data.status = buf.readUInt8(0)
    data.statusText = NodeInformationStatus[data.status]
    data.nodeID = buf.readUInt8(1)
    return data
  },


  /*
    Command                         |Data 1 |Data 2 - 65 |Data 66 - 67 |Data 68
    GW_NODE_INFORMATION_CHANGED_NTF |NodeID |Name        |Order        |Placement

    Data 69
    NodeVariation


    -in
    buffer

    - out
    json data
    {
      nodeID: [int],
      nodeName: [string],
      order: [int],
      placement: [int],
      nodeVariation: [int],
      nodeVariationTag: [string],
      nodeVariationText: [string]
    }
  */
  GW_NODE_INFORMATION_CHANGED_NTF:  function (buf) {
    var data = {}
    data.nodeID = buf.readUInt8(0)
    data.nodeName = Tools.getString(buf,1,64,'utf8')
    data.order = buf.readUInt16BE(65)
    data.placement = buf.readUInt8(67)
    data.nodeVariation = buf.readUInt8(68)
    data.nodeVariationTag = Tools.nameFromId(data.nodeVariation,NodeVariationTag)
    data.nodeVariationText = NodeVariationDescription[data.nodeVariationTag]
    return data
  },


  /*
    Command                            |Data 1 |Data 2 |Data 3 - 4      |Data 5 - 6
    GW_NODE_STATE_POSITION_CHANGED_NTF |NodeID |State  |CurrentPosition |Target

    Data 7 - 8         |Data 9 - 10        |Data 11 -12        |Data 13 - 14       |Data 15 - 16
    FP1CurrentPosition |FP2CurrentPosition |FP3CurrentPosition |FP4CurrentPosition |RemainingTime

    Data 17 - 20
    TimeStamp

    -in
    buffer

    - out
    json data
    {
      nodeID : [int],
      state : [int],
      stateTag : [String],
      stateText : [String],
      currentPosition : [value],
      target : [value],
      fp1CurrentPosition : [value],
      fp2CurrentPosition : [value],
      fp3CurrentPosition : [value],
      fp4CurrentPosition : [value],
      remainingTime : [int],
      timeStamp : [int],
      utcTimeStamp : [date]
    }
    - subtype
    json value {
      value: [fload],
      valueType: [string],
      rawValue: [int]
    }
  */
  GW_NODE_STATE_POSITION_CHANGED_NTF:  function (buf) {
    var data = {}
    data.nodeID = buf.readUInt8(0)
    data.state = buf.readUInt8(1)
    data.stateTag = OperatingStateTag[data.state]
    data.stateText = OperatingStateDescription[data.state]
    data.currentPosition = Tools.getPosition(buf.readUInt16BE(2))
    data.target = Tools.getPosition(buf.readUInt16BE(4))
    data.fp1CurrentPosition = Tools.getPosition(buf.readUInt16BE(6))
    data.fp2CurrentPosition = Tools.getPosition(buf.readUInt16BE(8))
    data.fp3CurrentPosition = Tools.getPosition(buf.readUInt16BE(10))
    data.fp4CurrentPosition = Tools.getPosition(buf.readUInt16BE(12))
    data.remainingTime = buf.readUInt16BE(14)
    data.timeStamp = buf.readInt32BE(16)
    data.utcTimeStamp = new Date(data.timeStamp*1000)
    return data
  },


  /*
    Command                             |Data 1 |Data 2
    GW_SET_NODE_ORDER_AND_PLACEMENT_CFM |Status |NodeID

    -in
    buffer

    - out
    json data
    {
      status: [int],
      statusText: [string],
      nodeID: [int]
    }
  */
  GW_SET_NODE_ORDER_AND_PLACEMENT_CFM:  function (buf) {
    var data = {}
    data.status = buf.readUInt8(0)
    data.statusText = NodeInformationStatus[data.status]
    data.nodeID = buf.readUInt8(1)
    return data
  },


  /*
    Command                      |Data 1 |Data 2
    GW_GET_GROUP_INFORMATION_CFM |Status |GroupID

    -in
    buffer

    - out
    json data
    {
      status: [int],
      statusText: [string],
      groupID: [int]
    }
  */
  GW_GET_GROUP_INFORMATION_CFM:  function (buf) {
    var data = {}
    data.status = buf.readUInt8(0)
    data.statusText = GroupInformationStatus[data.status]
    data.groupID = buf.readUInt8(1)
    return data
  },


  /*
    Command                      |Data 1  |Data 2 - 3 |Data 4    |Data 5 - 68
    GW_GET_GROUP_INFORMATION_NTF |GroupID |Order      |Placement |Name

    Data 69  |Data 70       |Data 71   |Data 72      |Data 73 – 97     |Data 98 – 99
    Velocity |NodeVariation |GroupType |NbrOfObjects |ActuatorBitArray |Revision

    -in
    buffer

    - out
    json data
    {
      groupID : [int]
      order: [int]
      placement: [int]
      groupName = Tools.getString(buf,4,64,'utf8')
      velocity: [int]
      velocityTag = Tools.nameFromId(data.velocity,VelocityTag)
      velocityText = VelocityDescription[data.velocityTag]
      nodeVariation: [int]
      nodeVariationTag = Tools.nameFromId(data.nodeVariation,NodeVariationTag)
      nodeVariationText = NodeVariationDescription[data.nodeVariationTag]
      groupType: [int]
      groupTypeTag: [string]
      groupTypeText: [string]
      nbrOfObjects: [int]
      actuatorBitArray: [string]
      revision: [int]
    }
  */
  GW_GET_GROUP_INFORMATION_NTF:  function (buf) {
    var data = {}
    data.groupID = buf.readUInt8(0)
    data.order = buf.readUInt16BE(1)
    data.placement = buf.readUInt8(3)
    data.groupName = Tools.getString(buf,4,64,'utf8')
    data.velocity = buf.readUInt8(68)
    data.velocityTag = Tools.nameFromId(data.velocity,VelocityTag)
    data.velocityText = VelocityDescription[data.velocityTag]
    data.nodeVariation = buf.readUInt8(69)
    data.nodeVariationTag = Tools.nameFromId(data.nodeVariation,NodeVariationTag)
    data.nodeVariationText = NodeVariationDescription[data.nodeVariationTag]
    data.groupType = buf.readUInt8(70)
    data.groupTypeTag = Tools.nameFromId(data.groupType,GroupType)
    data.groupTypeText = GroupTypeDescription[data.groupTypeTag]
    data.nbrOfObjects = buf.readUInt8(71)
    data.actuatorBitArray = getActuator(buf,72)
    data.revision = buf.readUInt16BE(97)
    return data
  },


  /*
    Command                      |Data 1 |Data 2
    GW_SET_GROUP_INFORMATION_CFM |Status |GroupID

    -in
    buffer

    - out
    json data
    {
    }
  */
  GW_SET_GROUP_INFORMATION_CFM:  function (buf) {
    var data = {}
    data.status = buf.readUInt8(0)
    data.statusText = SetGroupStatus[data.status]
    data.groupID = buf.readUInt8(1)
    return data
  },


  /*
    Command                          |Data 1                       |Data 2
    GW_GROUP_INFORMATION_CHANGED_NTF |ChangeType = “Group Deleted” |GroupID


    Command                          |Data 1                              |Data 2
    GW_GROUP_INFORMATION_CHANGED_NTF |ChangeType = “Information Modified” |GroupID

    Data 3 - 4 |Data 5    |Data 6 - 69 |Data 70  |Data 71       |Data 72   |Data 73
    Order      |Placement |Name        |Velocity |NodeVariation |GroupType |NbrOfObjects

    Data 74 – 98     |Data 99 – 100
    ActuatorBitArray |Revision

    -in
    buffer

    - out
    json data
    {
      changeType : [int]
      changeTypeText : [int]
      groupID : [int]
      order: [int]
      placement: [int]
      groupName = Tools.getString(buf,4,64,'utf8')
      velocity: [int]
      velocityTag = Tools.nameFromId(data.velocity,VelocityTag)
      velocityText = VelocityDescription[data.velocityTag]
      nodeVariation: [int]
      nodeVariationTag = Tools.nameFromId(data.nodeVariation,NodeVariationTag)
      nodeVariationText = NodeVariationDescription[data.nodeVariationTag]
      groupType: [int]
      groupTypeTag: [string]
      groupTypeText: [string]
      nbrOfObjects: [int]
      actuatorBitArray: [string]
      revision: [int]
    }
  */
  GW_GROUP_INFORMATION_CHANGED_NTF:  function (buf) {
    var data = {}
    data.changeType = buf.readUInt8(0)
    data.changeTypeText = GroupChangeType[data.changeType]
    data.groupID = buf.readUInt8(1)
    if (data.changeType == 1) {
      data.order = buf.readUInt16BE(2)
      data.placement = buf.readUInt8(4)
      data.groupName = Tools.getString(buf,5,64,'utf8')
      data.velocity = buf.readUInt8(69)
      data.velocityTag = Tools.nameFromId(data.velocity,VelocityTag)
      data.velocityText = VelocityDescription[data.velocityTag]
      data.nodeVariation = buf.readUInt8(70)
      data.nodeVariationTag = Tools.nameFromId(data.nodeVariation,NodeVariationTag)
      data.nodeVariationText = NodeVariationDescription[data.nodeVariationTag]
      data.groupType = buf.readUInt8(71)
      data.groupTypeTag = Tools.nameFromId(data.groupType,GroupType)
      data.groupTypeText = GroupTypeDescription[data.groupTypeTag]
      data.nbrOfObjects = buf.readUInt8(72)
      data.actuatorBitArray = getActuator(buf,73)
      data.revision = buf.readUInt16BE(98)
    }
    return data
  },


  /*
    Command             |Data 1  |Data 2
    GW_DELETE_GROUP_CFM |GroupID |Status

    -in
    buffer

    - out
    json data
    {
      groupID:  [int],
      status: [int],
      statusText: [string]
    }
  */
  GW_DELETE_GROUP_CFM:  function (buf) {
    var data = {}
    data.groupID = buf.readUInt8(0)
    data.status = buf.readUInt8(1)
    data.statusText = GroupInformationStatus[data.status]
    return data
  },


  /*
    Command          |Data 1 |Data 2
    GW_NEW_GROUP_CFM |Status |GroupID

    -in
    buffer

    - out
    json data
    {
      status: [int],
      statusText: [string],
      groupID: [int]
    }
  */
  GW_NEW_GROUP_CFM:  function (data) {
    data.status = buf.readUInt8(0)
    data.statusText = GroupInformationStatus[data.status]
    data.groupID = buf.readUInt8(1)
  },


  /*
    Command                           |Data 1 |Data 2
    GW_GET_ALL_GROUPS_INFORMATION_CFM |Status |TotalNumberOfGroups

    -in
    buffer

    - out
    json data
    {
      status: [int],
      statusText: [string],
      totalNumberOfGroups: [int]
    }
  */
  GW_GET_ALL_GROUPS_INFORMATION_CFM:  function (buf) {
    var data = {}
    data.status = buf.readInt8(0)
    data.statusText = AllGroupInformationStatus[data.status]
    data.totalNumberOfGroups = buf.readInt8(1)
    return data
  },


  /*
    Command                           |Data 1  |Data 2 - 3 |Data 4    |Data 5 - 68
    GW_GET_ALL_GROUPS_INFORMATION_NTF |GroupID |Order      |Placement |Name

    Data 69 | Data 70       |Data 71   |Data 72      |Data 73 – 97    |Data 98 – 99
    Velocity |NodeVariation |GroupType |NbrOfObjects |ActuatorBitArray |Revision

    -in
    buffer

    - out
    json data
    {
      groupID: [int],
      order: [int],
      placement: [int],
      groupName: [int],
      velocity: [int],
      velocityTag: [string],
      velocityText: [string],
      nodeVariation: [int],
      nodeVariationTag: [string],
      nodeVariationText: [string],
      groupType: [int],
      groupTypeTag: [string],
      groupTypeText: [string],
      nbrOfObjects: [int],
      actuatorBitArray: [array of boolean]
      revision: [int]
    }
  */
  GW_GET_ALL_GROUPS_INFORMATION_NTF:  function (buf) {
    var data = {}
    data.groupID = buf.readUInt8(0)
    data.order = buf.readUInt16BE(1)
    data.placement = buf.readUInt8(3)
    data.groupName = Tools.getString(buf,4,64,'utf8')
    data.velocity = buf.readUInt8(68)
    data.velocityTag = Tools.nameFromId(data.velocity,VelocityTag)
    data.velocityText = VelocityDescription[data.velocityTag]
    data.nodeVariation = buf.readUInt8(69)
    data.nodeVariationTag = Tools.nameFromId(data.nodeVariation,NodeVariationTag)
    data.nodeVariationText = NodeVariationDescription[data.nodeVariationTag]
    data.groupType = buf.readUInt8(70)
    data.groupTypeTag = Tools.nameFromId(data.groupType,GroupType)
    data.groupTypeText = GroupTypeDescription[data.groupTypeTag]
    data.nbrOfObjects = buf.readUInt8(71)
    data.actuatorBitArray = getActuator(buf,72)
    data.revision = buf.readUInt16BE(97)
    return data
  },


  /*
    Command
    GW_GET_ALL_GROUPS_INFORMATION_FINISHED_NTF

    -in
    buffer

    - out
    json data
    {
    }
  */
  GW_GET_ALL_GROUPS_INFORMATION_FINISHED_NTF:  function (buf) {
    var data = {}
    return data
  },


  /*
    Command              |Data 1
    GW_GROUP_DELETED_NTF |GroupID

    -in
    buffer

    - out
    json data
    {
      groupID: [int]
    }
  */
  GW_GROUP_DELETED_NTF:  function (buf) {
    var data = {}
    data.groupID = buf.readUInt8(0)
    return data
  },


  /*
    Command
    GW_HOUSE_STATUS_MONITOR_ENABLE_CFM

    -in
    buffer

    - out
    json data
    {
    }
  */
  GW_HOUSE_STATUS_MONITOR_ENABLE_CFM:  function (buf) {
    var data = {}
    return data
  },


  /*
    Command
    GW_HOUSE_STATUS_MONITOR_DISABLE_CFM

    -in
    buffer

    - out
    json data
    {
    }
  */
  GW_HOUSE_STATUS_MONITOR_DISABLE_CFM:  function (buf) {
    var data = {}
    return data
  },


  /*
    Command             |Data 1 – 2 |Data 3
    GW_COMMAND_SEND_CFM |SessionID  |Status


    -in
    buffer

    - out
    json data
    {
      sessionID: [int],
      status: [int],
      statusText: [string]
    }
  */
  GW_COMMAND_SEND_CFM:  function (buf) {
    var data = {}
    data.sessionID = buf.readUInt16BE(0)
    data.status = buf.readUInt8(2)
    data.statusText = StatusCommand[data.status]
    return data
  },


  /*
    Command                   |Data 1 - 2 |Data 3   |Data 4 |Data 5        |Data 6 – 7
    GW_COMMAND_RUN_STATUS_NTF |SessionID  |StatusID |Index  |NodeParameter |ParameterValue

    Data 8    |Data 9      |Data 10 - 13
    RunStatus |StatusReply |InformationCode


    -in
    buffer

    - out
    json data
    {
      sessionID: [int],
      statusID: [int],
      statusIDTyp: [text],
      statusIDText: [text],
      index: [int],
      nodeParameter: [int],
      nodeParameterTyp: [string],
      nodeParameterText: [string],
      parameterValue: [value],
      runStatus: [int],
      runStatusTyp: [text],
      runStatusText: [text],
      statusReply: [int],
      statusReplyTyp: [text],
      statusReplyText: [text],
      informationCode: [int],
    }

    - subtype
    json value {
      value: [fload],
      valueType: [string],
      rawValue: [int]
    }
  */
  GW_COMMAND_RUN_STATUS_NTF:  function (buf) {
    var data = {}
    data.sessionID = buf.readUInt16BE(0)
    data.statusID = buf.readUInt8(2)
    data.statusIDTyp = Tools.nameFromId(data.statusID,CommandStatusID)
    data.statusIDText = CommandStatusIDDescription[data.statusIDTyp]
    data.index = buf.readUInt8(3)
    data.nodeParameter = buf.readUInt8(4)
    data.nodeParameterTyp = Tools.nameFromId(data.nodeParameter,NodeParameter)
    data.nodeParameterText = NodeParameterDescription[data.nodeParameterTyp]
    data.parameterValue = Tools.getPosition(buf.readUInt16BE(5))
    data.runStatus = buf.readUInt8(7)
    data.runStatusTyp = Tools.nameFromId(data.runStatus,CommandRunStatus)
    data.runStatusText = CommandRunStatusDescription[data.runStatusTyp]
    data.statusReply = buf.readUInt8(8)
    data.statusReplyTyp = Tools.nameFromId(data.statusReply,CommandStatusReply)
    data.statusReplyText = CommandStatusReplyDescription[data.statusReplyTyp]
    data.informationCode = buf.readUInt32BE(9)
    return data
  },


  /*
    Command                       |Data 1 - 2 |Data 3 |Data 4        |Data 5 - 6
    GW_COMMAND_REMAINING_TIME_NTF |SessionID  |Index  |NodeParameter |Seconds

    -in
    buffer

    - out
    json data
    {
      sessionID: [int],
      index: [int],
      nodeParameter: [int],
      nodeParameterTyp: [string],
      nodeParameterText: [string],
      seconds: [int]
    }
  */
  GW_COMMAND_REMAINING_TIME_NTF:  function (buf) {
    var data = {}
    data.sessionID = buf.readUInt16BE(0)
    data.index = buf.readUInt8(2)
    data.nodeParameter = buf.readUInt8(3)
    data.nodeParameterTyp = Tools.nameFromId(data.nodeParameter,NodeParameter)
    data.nodeParameterText = NodeParameterDescription[data.nodeParameterTyp]
    data.seconds = buf.readUInt16BE(4)
    return data
  },


  /*
    Command                 |Data 1 - 2
    GW_SESSION_FINISHED_NTF |SessionID

    -in
    buffer

    - out
    json data
    {
      sessionID: [int],
    }
  */
  GW_SESSION_FINISHED_NTF:  function (buf) {
    var data = {}
    data.sessionID = buf.readUInt16BE(0)
    return data
  },


  /*
    Command               |Data 1 – 2 |Data 3
    GW_STATUS_REQUEST_CFM |SessionID  |Status

    -in
    buffer

    - out
    json data
    {
      sessionID: [int],
      status: [int],
      statusText: [string]
    }
  */
  GW_STATUS_REQUEST_CFM:  function (buf) {
    var data = {}
    data.sessionID = buf.readUInt16BE(0)
    data.status = buf.readUInt8(2)
    data.statusText = StatusCommand[data.status]
    return data
  },


  /*
    Command               |Data 1 – 2 |Data 3   |Data 4    |Data 5    |Data 6
    GW_STATUS_REQUEST_NTF |SessionID  |StatusID |NodeIndex |RunStatus |StatusReply

    Data 7                             |Data 8      |Data 9 - 59
    StatusType = “Target Position” or  |StatusCount |ParameterData
    StatusType = “Current Position” or |            |
    StatusType = “Remaining Time”      |            |



    Command               |Data 1 – 2 |Data 3   |Data 4    |Data 5    |Data 6
    GW_STATUS_REQUEST_NTF |SessionID  |StatusID |NodeIndex |RunStatus |StatusReply

    Data 7                   |Data 8 - 9     |Data 10 - 11    |Data 12 - 13
    StatusType = “Main Info” |TargetPosition |CurrentPosition |RemainingTime

    Data 14 - 17               |Data 18
    LastMasterExecutionAddress |LastCommandOriginator

    StatusType
       value     |Description
         0       |Request Target position
         1       |Request Current position
         2       |Request Remaining time
         3       |Request Main info.
    Other values |Not valid value.

    -in
    buffer

    - out
    json data
    {
      sessionID: [int],
      statusID: [int],
      statusIDTyp: [string],
      statusIDText: [string],
      index: [int],
      runStatus: [int],
      runStatusTyp: [string],
      runStatusText: [string],
      statusReply: [int],
      statusReplyTyp: [string],
      statusReplyText: [string],
      statusType: [int],
      statusTypeText: [string],

      statusCount: [int],
      parameterData: [array of parameterData]

      targetPosition: [value],
      currentPosition: [value],
      remainingTime: [int],
      lastMasterExecutionAddress: [int],
      lastCommandOriginator: [int],
      lastCommandOriginatorTyp: [string],
      lastCommandOriginatorText: [string]
    }

    - subtype
    json value {
      value: [fload],
      valueType: [string],
      rawValue: [int]
    }
  */
  GW_STATUS_REQUEST_NTF:  function (buf) {
    var data = {}
    data.sessionID = buf.readUInt16BE(0)
    data.statusID = buf.readUInt8(2)
    data.statusIDTyp = Tools.nameFromId(data.statusID,CommandStatusID)
    data.statusIDText = CommandStatusIDDescription[data.statusIDTyp]
    data.index = buf.readUInt8(3)
    data.runStatus = buf.readUInt8(4)
    data.runStatusTyp = Tools.nameFromId(data.runStatus,CommandRunStatus)
    data.runStatusText = CommandRunStatusDescription[data.runStatusTyp]
    data.statusReply = buf.readUInt8(5)
    data.statusReplyTyp = Tools.nameFromId(data.statusReply,CommandStatusReply)
    data.statusReplyText = CommandStatusReplyDescription[data.statusReplyTyp]
    data.statusType = buf.readUInt8(6)
    data.statusTypeText = RequestStatusType[data.statusType]
    switch  (data.statusType) {
      case 0:
      case 1:
      case 2:
        data.statusCount = buf.readUInt8(7)
        data.parameterData = []
        for (var i = 0; i<data.statusCount; i++) {
          var parameterData = {}
          parameterData.nodeParameter = buf.readUInt8(8+i*3)
          parameterData.nodeParameterTyp = Tools.nameFromId(parameterData.nodeParameter,NodeParameter)
          parameterData.nodeParameterText = NodeParameterDescription[parameterData.nodeParameterTyp]
          parameterData.parameter = buf.readUInt16BE(8+i*3)
          parameterData.parameterValue = parameterData.parameter/((data.statusType==2)?1:2)
          data.parameterData[i] = parameterData
        }
        break
      case 3:
        data.targetPosition = Tools.getPosition(buf.readUInt16BE(7))
        data.currentPosition = Tools.getPosition(buf.readUInt16BE(9))
        data.remainingTime = buf.readUInt16BE(11)
        data.lastMasterExecutionAddress = buf.readUInt32BE(13)
        data.lastCommandOriginator = buf.readUInt8(17)
        data.lastCommandOriginatorTyp = Tools.nameFromId(data.lastCommandOriginator,CommandOriginator)
        data.lastCommandOriginatorText = CommandOriginatorDescription[data.lastCommandOriginatorTyp]
        break
    }
    return data
  },


  /*
    Command          |Data 1 – 2 |Data 3
    GW_WINK_SEND_CFM |SessionID  |Status

    -in
    buffer

    - out
    json data
    {
      sessionID: [int],
      status: [int],
      statusText: [string]
    }
  */
  GW_WINK_SEND_CFM:  function (buf) {
    var data = {}
    data.sessionID = buf.readUInt16BE(0)
    data.status = buf.readUInt8(2)
    data.statusText = StatusWinkCommand[data.status]
    return data
  },

  /*
    Command          |Data 1 – 2
    GW_WINK_SEND_NTF |SessionID

    -in
    buffer

    - out
    json data
    {
      sessionID: [int],
    }
  */
  GW_WINK_SEND_NTF:  function (buf) {
    var data = {}
    data.sessionID = buf.readUInt16BE(0)
    return data
  },


  /*
    Command                  |Data 1 - 2 |Data 3
    ST_GW_SET_LIMITATION_CFM |SessionID  |Status

    -in
    buffer

    - out
    json data
    {
      sessionID: [int],
      status: [int],
      statusText: [string]
    }
  */
  ST_GW_SET_LIMITATION_CFM:  function (buf) {
    var data = {}
    data.sessionID = buf.readUInt16BE(0)
    data.status = buf.readUInt8(2)
    data.statusText = StatusCommand[data.status]
    return data
  },


  /*
    Command                      |Data 1 - 2 |Data 3
    GW_GET_LIMITATION_STATUS_CFM |SessionID  |Status

    -in
    buffer

    - out
    json data
    {
    }
  */
  GW_GET_LIMITATION_STATUS_CFM:  function (buf) {
    var data = {}
    data.sessionID = buf.readUInt16BE(0)
    data.status = (buf.readUInt8(2)==1)
    return data
  },


  /*
    Command                  |Data 1 - 2 |Data 3 |Data 4      |Data 5-6 |Data 7-8
    GW_LIMITATION_STATUS_NTF |SessionID  |NodeID |ParameterID |MinValue |MaxValue

    Data 9               |Data 10
    LimitationOriginator |LimitationTime


    -in
    buffer

    - out
    json data
    {
      sessionID: [int],
      nodeID: [int],
      parameterID: [int],
      parameterTyp: [string],
      parameterText: [string],
      minValue: [value],
      maxValue: [value],
      limitationOriginator: [int],
      limitationOriginatorTyp: [string],
      limitationOriginatorText: [string],
      limitationTime: [int],
    }
  */
  GW_LIMITATION_STATUS_NTF:  function (buf) {
    var data = {}
    data.sessionID = buf.readUInt16BE(0)
    data.nodeID = buf.readUInt8(2)
    data.parameterID = buf.readUInt8(3)
    data.parameterTyp = Tools.nameFromId(data.parameter,NodeParameter)
    data.parameterText = NodeParameterDescription[data.parameterTyp]
    data.minValue = Tools.getPosition(buf.readUInt16BE(4))
    data.maxValue = Tools.getPosition(buf.readUInt16BE(6))
    data.limitationOriginator = buf.readUInt8(8)
    data.limitationOriginatorTyp = Tools.nameFromId(data.limitationOriginator,CommandOriginator)
    data.limitationOriginatorText = CommandOriginatorDescription[data.limitationOriginatorTyp]
    data.limitationTime = buf.readUInt8(9)
    return data
  },




  /*
    Command          |Data 1 – 2 |Data 3
    GW_MODE_SEND_CFM |SessionID  |Status

    -in
    buffer

    - out
    json data
    {
      sessionID: [int]
      status: [int]
      statusText: [string]
    }
  */
  GW_MODE_SEND_CFM:  function (buf) {
    var data = {}
    data.sessionID = buf.readUInt16BE(0)
    data.status = buf.readUInt8(2)
    data.statusText = ModeStatus[data.status]
    return data
  },


  /*

  */
  GW_MODE_SEND_NTF:  function (buf) {
    var data = {}
    data.unknown = buf.toString('hex')
    return data
  },


  /*
    Command                 |Data 1
    GW_INITIALIZE_SCENE_CFM |Status

    -in
    buffer

    - out
    json data
    {
      status: [int],
      statusText: [string]
    }
  */
  GW_INITIALIZE_SCENE_CFM:  function (buf) {
    var data = {}
    data.status = buf.readUInt8(0)
    data.statusText = SceneStatus[data.status]
    return data
  },


  /*
    Command                 |Data 1 |Data 2 - 26
    GW_INITIALIZE_SCENE_NTF |Status |NodeState

    -in
    buffer

    - out
    json data
    {
      status: [int],
      statusText: [string],
      nodeState: [array of bool]
    }
  */
  GW_INITIALIZE_SCENE_NTF:  function (buf) {
    var data = {}
    data.status = buf.readUInt8(0)
    data.statusText = SceneStatusNTF[data.status]
    data.nodeState = []
    for (var i=0;i<25;i++){
      data.nodeState[i] = (buf.readUInt8(1+i)==0)
    }
    return data

  },


  /*
    Command                        |Data 1
    GW_INITIALIZE_SCENE_CANCEL_CFM |Status

    -in
    buffer

    - out
    json data
    {
      status: [bool]
    }
  */
  GW_INITIALIZE_SCENE_CANCEL_CFM:  function (buf) {
    var data = {}
    data.status = (buf.readUInt8(0)==0)
    return data
  },


  /*
    Command             |Data 1
    GW_RECORD_SCENE_CFM |Status

    -in
    buffer

    - out
    json data
    {
      status: [bool]
    }
  */
  GW_RECORD_SCENE_CFM:  function (buf) {
    var data = {}
    data.status = (buf.readUInt8(0)==0)
    return data
  },


  /*
    Command             |Data 1 |Data 2
    GW_RECORD_SCENE_NTF |Status |SceneID

    -in
    buffer

    - out
    json data
    {
      status: [int],
      statusText: [string],
      sceneID: [int]
    }
  */
  GW_RECORD_SCENE_NTF:  function (buf) {
    var data = {}
    data.status = buf.readUInt8(0)
    data.statusText = SceneRecordStatus[data.status]
    data.sceneID = buf.readUInt8(1)
    return data
  },


  /*
    Command             |Data 1 |Data 2
    GW_DELETE_SCENE_CFM |Status |SceneID

    -in
    buffer

    - out
    json data
    {
      status: [boolean],
      sceneID: [int]
    }
  */
  GW_DELETE_SCENE_CFM:  function (buf) {
    var data = {}
    data.status = (buf.readUInt8(0)==0)
    data.sceneID = buf.readUInt8(1)
    return data
  },


  /*
    Command             |Data 1 |Data 2
    GW_RENAME_SCENE_CFM |Status |SceneID

    -in
    buffer

    - out
    json data
    {
      status: [int],
      statusText: [string],
      sceneID: [int]
    }
  */
  GW_RENAME_SCENE_CFM:  function (buf) {
    var data = {}
    data.status = buf.readUInt8(0)
    data.statusText = SceneRenameStatus[data.status]
    data.sceneID = buf.readUInt8(1)
    return data
  },


  /*
    Command               |Data 1
    GW_GET_SCENE_LIST_CFM |TotalNumberOfObjects

    -in
    buffer

    - out
    json data
    {
      totalNumberOfObjects: [int]
    }
  */
  GW_GET_SCENE_LIST_CFM:  function (buf) {
    var data = {}
    data.totalNumberOfObjects = buf.readUInt8(0)
    return data
  },


  /*
    Command               |Data 1         |Data 2 - (n+1)   |Data (n+2)
    GW_GET_SCENE_LIST_NTF |NumberOfObject |SceneListObjects |RemainingNumberOfObject

    1 byte  |64 byte
    SceneID |SceneName

    -in
    buffer

    - out
    json data
    {
      totalNumberOfObjects: [int]
    }
  */
  GW_GET_SCENE_LIST_NTF:  function (buf) {
    var data = {}
    data.numberOfObject = buf.readUInt8(0)
    data.sceneListObjects = []
    for(var i=0;i<data.numberOfObject&&i<3;i++){
      data.sceneListObjects[i]={}
      data.sceneListObjects[i].sceneID = buf.readUInt8(1+(i*65))
      data.sceneListObjects[i].sceneName = Tools.getString(buf,2+(i*65),64,'utf8')
    }
    data.remainingNumberOfObject = buf.readUInt8(2+(data.numberOfObject*65))
    return data
  },


  /*
    Command                      |Data 1 |Data 2
    GW_GET_SCENE_INFORMATION_CFM |Status |SceneID

    -in
    buffer

    - out
    json data
    {
      status: [boolean],
      sceneID: [int]
    }
  */
  GW_GET_SCENE_INFOAMATION_CFM:  function (buf) {
    var data = {}
    data.status = (buf.readUInt8(0)==0)
    data.sceneID = buf.readUInt8(1)
    return data
  },


  /*
    Command                      |Data 1  |Data 2 – 65 |Data 66
    GW_GET_SCENE_INFORMATION_NTF |SceneID |SceneName   |NumberOfNodesObjects

    Data 67 - n |Data (n+1)
    NodeObjects |RemaningNodeObjects

    Data Type               |Field name      |Valid values
    8 bit unsigned integer  |NodeIndex       |[0;199]
    8 bit unsigned integer  |ParameterID     |[0;16]
    16 bit unsigned integer |Parameter value |[0;65535]

    -in
    buffer

    - out
    json data
    {
      sceneID: [int]
      sceneName: [string]
      numberOfNodesObjects: [int]
      nodeObjects = [array of nodeObject]
      remaningNodeObjects: [int]
    }

    -subtype
    json nodeObject
    {
      nodeIndex: [int]
      parameterID: [int]
      parameterTyp: [String]
      parameterText: [String]
      parameterValue: [value]
    }
  */
  GW_GET_SCENE_INFOAMATION_NTF:  function (buf) {
    var data = {}
    data.sceneID = buf.readUInt8(0)
    data.sceneName = Tools.getString(buf,1,64,'utf8')
    data.numberOfNodesObjects = buf.readUInt8(65)
    data.nodeObjects = []
    for (var i=0;i<data.numberOfNodesObjects&&i<45;i++){
      var nodeObject = {}
      nodeObject.nodeIndex = buf.readUInt8(66+i*4)
      nodeObject.parameterID = buf.readUInt8(67+i*4)
      nodeObject.parameterTyp = Tools.nameFromId(data.parameter,nodeObject.parameterID)
      nodeObject.parameterText = NodeParameterDescription[data.nodeObject.parameterTyp]
      nodeObject.parameterValue = Tools.getPosition(buf.readUInt16BE(68+i*4))
      data.nodeObjects[i]=nodeObject
    }
    data.remaningNodeObjects = buf.readUInt8(66+data.numberOfNodesObjects*4)
    return data
  },


  /*
    Command               |Data 1 |Data 2 – 3
    GW_ACTIVATE_SCENE_CFM |Status |SessionID

    -in
    buffer

    - out
    json data
    {
      status: [int],
      statusText: [string],
      sessionID: [int]
    }
  */
  GW_ACTIVATE_SCENE_CFM:  function (buf) {
    var data = {}
    data.status = buf.readUInt8(0)
    data.statusText = SceneActivateType[data.status]
    data.sessionID = buf.readUInt16BE(1)
    return data
  },


  /*
    Command           |Data 1 |Data 2 – 3
    GW_STOP_SCENE_CFM |Status |SessionID

    -in
    buffer

    - out
    json data
    {
      status: [int],
      statusText: [string],
      sessionID: [int]
    }
  */
  GW_STOP_SCENE_CFM:  function (buf) {
    var data = {}
    data.status = buf.readUInt8(0)
    data.statusText = SceneActivateType[data.status]
    data.sessionID = buf.readUInt16BE(1)
    return data
  },


  /*
    Command                          |Data 1     |Data 2
    GW_SCENE_INFORMATION_CHANGED_NTF |ChangeType |SceneID

    -in
    buffer

    - out
    json data
    {
      changeType: [int],
      changeTypeText: [string],
      sceneID: [int]
    }
  */
  GW_SCENE_INFORMATION_CHANGED_NTF:  function (buf) {
    var data = {}
    data.changeType = buf.readUInt8(0)
    data.changeTypeText = SceneChangeType[data.status]
    data.sceneID = buf.readUInt8(1)
    return data
  },


  /*
    Command                      |Data 1 - 2 |Data 3
    GW_ACTIVATE_PRODUCTGROUP_CFM |SessionID  |Status


    -in
    buffer

    - out
    json data
    {
      sessionID: [int]
      status: [int],
      statusText: [string],
    }
  */
  GW_ACTIVATE_PRODUCTGROUP_CFM:  function (buf) {
    var data = {}
    data.sessionID = buf.readUInt16BE(0)
    data.status = buf.readUInt8(3)
    data.statusText = ActivateProductGroup[data.status]
    return data
  },


  /*

  */
  GW_ACTIVATE_PRODUCTGROUP_NTF:  function (buf) {
    var data = {}
    data.unknown = buf.toString('hex')
    return data
  },


  /*
    Command                            |Data 1              |Data 2-161
    GW_GET_CONTACT_INPUT_LINK_LIST_CFM |NumberOfObject = 10 |ContactInputObjects


    Data 2 – 18              |Data 19 – 35              |Data 36 – 52             |… |Data 84 - 171
    First ContactInputObject |Second ContactInputObject |Third ContactInputObject |… |Tenth ContactInputObject

    -in
    buffer

    - out
    json data
    {
      numberOfObject: [int]
      contactInputObjects: [array of contactInputObject]
    }

    - subtype
    json contactInputObject
    {
      contactInputID: [int],
      contactInputAssignment: [int],
      contactInputAssignmentText: [string],
      ID: [int],
      commandOriginator: [int],
      commandOriginatorTyp: [string],
      commandOriginatorText: [string],
      priorityLevel: [int],
      priorityLevelText
      parameterID: [int],
      position: [position type]
      velocity: [int],
      velocityTag: [string],
      velocityText: [string],
      lockPriorityLevel: [int],
      lockPriorityLevelTyp: [string],
      lockPriorityLevelText: [string],
      pli_3: [int],
      pli_3Text: [string],
      pli_4: [int],
      pli_4Text: [string],
      pli_5: [int],
      pli_5Text: [string],
      pli_6: [int],
      pli_6Text: [string],
      pli_7: [int],
      pli_7Text: [string],
      successOutputID: [int],
      successOutputIDText: [string],
      errorOutputID: [int],
      errorOutputIDText: [string]
    }
  */
  GW_GET_CONTACT_INPUT_LINK_LIST_CFM:  function (buf) {
    var data = {}
    data.numberOfObject = buf.readUInt8(0)
    data.contactInputObjects = []
    for (var i=0;i<data.numberOfObject && i<10; i++) {
      var contactInputObject = {}
      contactInputObject.contactInputID = buf.readUInt8(1 + 17*i)
      contactInputObject.contactInputAssignment = buf.readUInt8(2 + 17*i)
      contactInputObject.contactInputAssignmentText = ContactInputAssignment[contactInputObject.contactInputAssignment]
      contactInputObject.ID = buf.readUInt8(3 + 17*i)
      contactInputObject.commandOriginator = buf.readUInt8(4 + 17*i)
      contactInputObject.commandOriginatorTyp = Tools.nameFromId(contactInputObject.commandOriginator,CommandOriginator)
      contactInputObject.commandOriginatorText = CommandOriginatorDescription[contactInputObject.commandOriginatorTyp]
      contactInputObject.priorityLevel = buf.readUInt8(5 + 17*i)
      contactInputObject.priorityLevelText = PriorityLevel[contactInputObject.priorityLevel]
      contactInputObject.parameterID = buf.readUInt8(6 + 17*i)
      contactInputObject.position = Tools.getPosition(buf.readUInt16BE(7 + 17*i))
      contactInputObject.velocity = buf.readUInt8(9 + 17*i)
      contactInputObject.velocityTag = Tools.nameFromId(contactInputObject.velocity,VelocityTag)
      contactInputObject.velocityText = VelocityDescription[contactInputObject.velocityTag]
      contactInputObject.lockPriorityLevel = buf.readUInt8(10 + 17*i)
      contactInputObject.lockPriorityLevelTyp = Tools.nameFromId(contactInputObject.lockPriorityLevel,LockPriorityLevel)
      contactInputObject.lockPriorityLevelText = LockPriorityLevelDescription[contactInputObject.lockPriorityLevelTyp]
      contactInputObject.pli_3 = buf.readUInt8(11 + 17*i)
      contactInputObject.pli_3Text = PLI[contactInputObject.pli_3]
      contactInputObject.pli_4 = buf.readUInt8(12 + 17*i)
      contactInputObject.pli_4Text = PLI[contactInputObject.pli_4]
      contactInputObject.pli_5 = buf.readUInt8(13 + 17*i)
      contactInputObject.pli_5Text = PLI[contactInputObject.pli_5]
      contactInputObject.pli_6 = buf.readUInt8(14 + 17*i)
      contactInputObject.pli_6Text = PLI[contactInputObject.pli_6]
      contactInputObject.pli_7 = buf.readUInt8(15 + 17*i)
      contactInputObject.pli_7Text = PLI[contactInputObject.pli_7]
      contactInputObject.successOutputID = buf.readUInt8(16 + 17*i)
      contactInputObject.successOutputIDText = OutputID[contactInputObject.successOutputID]
      contactInputObject.errorOutputID = buf.readUInt8(17 + 17*i)
      contactInputObject.errorOutputIDText = OutputID[contactInputObject.errorOutputID]
      data.contactInputObjects[i] = contactInputObject
    }
    return data
  },


  /*
    Command                       |Data 1         |Data 2
    GW_SET_CONTACT_INPUT_LINK_CFM |ContactInputID |Status

    -in
    buffer

    - out
    json data
    {
      contactInputID: [int],
      status: [bool]
    }
  */
  GW_SET_CONTACT_INPUT_LINK_CFM(buf) {
    var data = {}
    data.contactInputID = buf.readUInt8(0)
    data.status = (buf.readUInt8(1)==1)
    return data
  },


  /*
    Command                          |Data 1         |Data 2
    GW_REMOVE_CONTACT_INPUT_LINK_CFM |ContactInputID |Status

    -in
    buffer

    - out
    json data
    {
      contactInputID: [int],
      status: [bool]
    }
  */
  GW_REMOVE_CONTACT_INPUT_LINK_CFM(buf) {
    var data = {}
    data.contactInputID = buf.readUInt8(0)
    data.status = (buf.readUInt8(1)==1)
    return data
  },


  /*
    Command                          |Data 1-2     |Data 3 - 4
    GW_GET_ACTIVATION_LOG_HEADER_CFM |MaxLineCount |LineCount


    -in
    buffer

    - out
    json data
    {
      maxLineCount: [int],
      lineCount: [int]
    }
  */
  GW_GET_ACTIVATION_LOG_HEADER_CFM:  function (buf) {
    var data = {}
    data.maxLineCount = buf.writeUInt16BE(0)
    data.lineCount = buf.writeUInt16BE(2)
    return data
  },


  /*
    Command
    GW_CLEAR_ACTIVATION_LOG_CFM

    -in
    buffer

    - out
    json data
    {
    }
  */
  GW_CLEAR_ACTIVATION_LOG_CFM:  function (buf) {
    var data = {}
    return data
  },


  /*
    Command                        |Data 1 - 4 |Data 5 - 6 |Data 7   |Data 8 |Data 9
    GW_GET_ACTIVATION_LOG_LINE_CFM |TimeStamp  |SessionID  |StatusID |Index  |NodeParameter

    Data 10 – 11   |Data 12   |Data 13     |Data 14 - 17
    ParameterValue |RunStatus |StatusReply |InformationCode

    -in
    buffer

    - out
    json data
    {
      utcTime: [int]
      utcDatetime: [date]
      datetime: [date]
      sessionID: [int]
      statusID: [int]
      statusIDTyp: [string]
      statusIDText: [string]
      nodeIndex: [int]
      nodeParameter: [int]
      nodeParameterTyp: [string]
      nodeParameterText: [string]
      parameterValue: [value]
      runStatus: [int]
      runStatusTyp: [string]
      runStatusText: [string]
      statusReply: [int]
      statusReplyTyp: [string]
      statusReplyText: [string]
      informationCode: [int]
    }
  */
  GW_GET_ACTIVATION_LOG_LINE_CFM:  function (buf) {
    var data = {}
    data.utcTime = buf.readUInt32BE(0)
    data.utcDatetime = new Date(data.utcTime * 1000)
    data.datetime = Tools.utcToLocalTimestamp(data.utcDatetime)
    data.sessionID = buf.readUInt16BE(4)
    data.statusID = buf.readUInt8(6)
    data.statusIDTyp = Tools.nameFromId(data.statusID,CommandStatusID)
    data.statusIDText = CommandStatusIDDescription[data.statusIDTyp]
    data.index = buf.readUInt8(7)
    data.nodeParameter = buf.readUInt8(8)
    data.nodeParameterTyp = Tools.nameFromId(data.nodeParameter,NodeParameter)
    data.nodeParameterText = NodeParameterDescription[data.nodeParameterTyp]
    data.parameterValue = Tools.getPosition(buf.readUInt16BE(9))
    data.runStatus = buf.readUInt8(11)
    data.runStatusTyp = Tools.nameFromId(data.runStatus,CommandRunStatus)
    data.runStatusText = CommandRunStatusDescription[data.runStatusTyp]
    data.statusReply = buf.readUInt8(12)
    data.statusReplyTyp = Tools.nameFromId(data.statusReply,CommandStatusReply)
    data.statusReplyText = CommandStatusReplyDescription[data.statusReplyTyp]
    data.informationCode = buf.readUInt32BE(13)
    return data
  },


  /*
    Command
    GW_ACTIVATION_LOG_UPDATED_NTF

    -in
    buffer

    - out
    json data
    {
    }
  */
  GW_ACTIVATION_LOG_UPDATED_NTF:  function (buf) {
    var data = {}
    return data
  },


  /*
    Command                                  |Data 1 - 4 |Data 5 - 6 |Data 7   |Data 8
    GW_GET_MULTIPLE_ACTIVATION_LOG_LINES_NTF |TimeStamp  |SessionID  |StatusID |Index

    Data 9        |Data 10 – 11   |Data 12   |Data 13     |Data 14 - 17
    NodeParameter |ParameterValue |RunStatus |StatusReply |InformationCode

    -in
    buffer

    - out
    json data
    {
      utcTime: [int]
      utcDatetime: [date]
      datetime: [date]
      sessionID: [int]
      statusID: [int]
      statusIDTyp: [string]
      statusIDText: [string]
      nodeIndex: [int]
      nodeParameter: [int]
      nodeParameterTyp: [string]
      nodeParameterText: [string]
      parameterValue: [value]
      runStatus: [int]
      runStatusTyp: [string]
      runStatusText: [string]
      statusReply: [int]
      statusReplyTyp: [string]
      statusReplyText: [string]
      informationCode: [int]
    }
  */
  GW_GET_MULTIPLE_ACTIVATION_LOG_LINES_NTF:  function (buf) {
    var data = {}
    data.utcTime = buf.readUInt32BE(0)
    data.utcDatetime = new Date(data.utcTime * 1000)
    data.datetime = Tools.utcToLocalTimestamp(data.utcDatetime)
    data.sessionID = buf.readUInt16BE(4)
    data.statusID = buf.readUInt8(6)
    data.statusIDTyp = Tools.nameFromId(data.statusID,CommandStatusID)
    data.statusIDText = CommandStatusIDDescription[data.statusIDTyp]
    data.index = buf.readUInt8(7)
    data.nodeParameter = buf.readUInt8(8)
    data.nodeParameterTyp = Tools.nameFromId(data.nodeParameter,NodeParameter)
    data.nodeParameterText = NodeParameterDescription[data.nodeParameterTyp]
    data.parameterValue = Tools.getPosition(buf.readUInt16BE(9))
    data.runStatus = buf.readUInt8(11)
    data.runStatusTyp = Tools.nameFromId(data.runStatus,CommandRunStatus)
    data.runStatusText = CommandRunStatusDescription[data.runStatusTyp]
    data.statusReply = buf.readUInt8(12)
    data.statusReplyTyp = Tools.nameFromId(data.statusReply,CommandStatusReply)
    data.statusReplyText = CommandStatusReplyDescription[data.statusReplyTyp]
    data.informationCode = buf.readUInt32BE(13)
    return data
  },


  /*
    Command                                  |Data 1-2  |Data 3
    GW_GET_MULTIPLE_ACTIVATION_LOG_LINES_CFM |LineCount |Status

    -in
    buffer

    - out
    json data
    {
      lineCount: [int]
      status: [boolean]
    }
  */
  GW_GET_MULTIPLE_ACTIVATION_LOG_LINES_CFM:  function (buf) {
    var data = {}
    data.lineCount = buf.readUInt16BE(0)
    data.status = (buf.readUInt8(2)==1)
    return data
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
    data.utcDatetime = new Date(data.utcTime * 1000)
    data.datetime = Tools.utcToLocalTimestamp(data.utcDatetime)
    data.second = buf.readUInt8(4)
    data.minute = buf.readUInt8(5)
    data.hour = buf.readUInt8(6)
    data.dayOfMonth = buf.readUInt8(7)
    data.month = buf.readUInt8(8)
    data.year = buf.readInt16BE(9)
    data.weekDay = buf.readUInt8(11)
    data.dayOfYear = buf.readUInt16BE(12)
    data.daylightSavingFlag = buf.readInt8(14)
    data.daylightSavingFlagTxt = DaylightSavingFlag[data.daylightSavingFlag]
    return data
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
    data.newPassword = Tools.getString(buf,0,32)
    return data
  }
}
exports.APIFunctionIN = APIFunctionIN
