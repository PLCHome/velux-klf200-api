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

const GW_ERROR_NTF = 0x0000 // Provides information on what triggered the error.
const GW_REBOOT_REQ = 0x0001 // Request gateway to reboot.
const GW_REBOOT_CFM = 0x0002 // Acknowledge to GW_REBOOT_REQ command.
const GW_SET_FACTORY_DEFAULT_REQ = 0x0003 // Request gateway to clear system table, scene table and set Ethernet settings to factory default. Gateway will reboot.
const GW_SET_FACTORY_DEFAULT_CFM = 0x0004 // Acknowledge to GW_SET_FACTORY_DEFAULT_REQ command.
const GW_GET_VERSION_REQ = 0x0008 // Request version information.
const GW_GET_VERSION_CFM = 0x0009 // Acknowledge to GW_GET_VERSION_REQ command.
const GW_GET_PROTOCOL_VERSION_REQ = 0x000A // Request KLF 200 API protocol version.
const GW_GET_PROTOCOL_VERSION_CFM = 0x000B // Acknowledge to GW_GET_PROTOCOL_VERSION_REQ command.
const GW_GET_STATE_REQ = 0x000C // Request the state of the gateway
const GW_GET_STATE_CFM = 0x000D // Acknowledge to GW_GET_STATE_REQ command.
const GW_LEAVE_LEARN_STATE_REQ = 0x000E // Request gateway to leave learn state.
const GW_LEAVE_LEARN_STATE_CFM = 0x000F // Acknowledge to GW_LEAVE_LEARN_STATE_REQ command.

const GW_GET_NETWORK_SETUP_REQ = 0x00E0 // Request network parameters.
const GW_GET_NETWORK_SETUP_CFM = 0x00E1 // Acknowledge to GW_GET_NETWORK_SETUP_REQ.
const GW_SET_NETWORK_SETUP_REQ = 0x00E2 // Set network parameters.
const GW_SET_NETWORK_SETUP_CFM = 0x00E3 // Acknowledge to GW_SET_NETWORK_SETUP_REQ.

const GW_CS_GET_SYSTEMTABLE_DATA_REQ = 0x0100 // Request a list of nodes in the gateways system table.
const GW_CS_GET_SYSTEMTABLE_DATA_CFM = 0x0101 // Acknowledge to GW_CS_GET_SYSTEMTABLE_DATA_REQ
const GW_CS_GET_SYSTEMTABLE_DATA_NTF = 0x0102 // Acknowledge to GW_CS_GET_SYSTEM_TABLE_DATA_REQList of nodes in the gateways systemtable.
const GW_CS_DISCOVER_NODES_REQ = 0x0103 // Start CS DiscoverNodes macro in KLF200.
const GW_CS_DISCOVER_NODES_CFM = 0x0104 // Acknowledge to GW_CS_DISCOVER_NODES_REQ command.
const GW_CS_DISCOVER_NODES_NTF = 0x0105 // Acknowledge to GW_CS_DISCOVER_NODES_REQ command.
const GW_CS_REMOVE_NODES_REQ = 0x0106 // Remove one or more nodes in the systemtable.
const GW_CS_REMOVE_NODES_CFM = 0x0107 // Acknowledge to GW_CS_REMOVE_NODES_REQ.
const GW_CS_VIRGIN_STATE_REQ = 0x0108 // Clear systemtable and delete system key.
const GW_CS_VIRGIN_STATE_CFM = 0x0109 // Acknowledge to GW_CS_VIRGIN_STATE_REQ.
const GW_CS_CONTROLLER_COPY_REQ = 0x010A // Setup KLF200 to get or give a system to or from another io-homecontrol® remote control.By a system means all nodes in the systemtable and the system key.
const GW_CS_CONTROLLER_COPY_CFM = 0x010B // Acknowledge to GW_CS_CONTROLLER_COPY_REQ.
const GW_CS_CONTROLLER_COPY_NTF = 0x010C // Acknowledge to GW_CS_CONTROLLER_COPY_REQ.
const GW_CS_CONTROLLER_COPY_CANCEL_NTF = 0x010D // Cancellation of system copy to other controllers.
const GW_CS_RECEIVE_KEY_REQ = 0x010E // Receive system key from another controller.
const GW_CS_RECEIVE_KEY_CFM = 0x010F // Acknowledge to GW_CS_RECEIVE_KEY_REQ.
const GW_CS_RECEIVE_KEY_NTF = 0x0110 // Acknowledge to GW_CS_RECEIVE_KEY_REQ with status.
const GW_CS_PGC_JOB_NTF = 0x0111 // Information on Product Generic Configuration job initiated by press on PGC button.
const GW_CS_SYSTEM_TABLE_UPDATE_NTF = 0x0112 // Broadcasted to all clients and gives information about added and removed actuator nodes in system table.
const GW_CS_GENERATE_NEW_KEY_REQ = 0x0113 // Generate new system key and update actuators in systemtable.
const GW_CS_GENERATE_NEW_KEY_CFM = 0x0114 // Acknowledge to GW_CS_GENERATE_NEW_KEY_REQ.
const GW_CS_GENERATE_NEW_KEY_NTF = 0x0115 // Acknowledge to GW_CS_GENERATE_NEW_KEY_REQ with status.
const GW_CS_REPAIR_KEY_REQ = 0x0116 // Update key in actuators holding an old key.
const GW_CS_REPAIR_KEY_CFM = 0x0117 // Acknowledge to GW_CS_REPAIR_KEY_REQ.
const GW_CS_REPAIR_KEY_NTF = 0x0118 // Acknowledge to GW_CS_REPAIR_KEY_REQ with status.
const GW_CS_ACTIVATE_CONFIGURATION_MODE_REQ = 0x0119 // Request one or more actuator to open for configuration.
const GW_CS_ACTIVATE_CONFIGURATION_MODE_CFM = 0x011A // Acknowledge to GW_CS_ACTIVATE_CONFIGURATION_MODE_REQ.

const GW_GET_NODE_INFORMATION_REQ = 0x0200 // Request extended information of one specific actuator node.
const GW_GET_NODE_INFORMATION_CFM = 0x0201 // Acknowledge to GW_GET_NODE_INFORMATION_REQ.
const GW_GET_NODE_INFORMATION_NTF = 0x0210 // Acknowledge to GW_GET_NODE_INFORMATION_REQ.
const GW_GET_ALL_NODES_INFORMATION_REQ = 0x0202 // Request extended information of all nodes.
const GW_GET_ALL_NODES_INFORMATION_CFM = 0x0203 // Acknowledge to GW_GET_ALL_NODES_INFORMATION_REQ
const GW_GET_ALL_NODES_INFORMATION_NTF = 0x0204 // Acknowledge to GW_GET_ALL_NODES_INFORMATION_REQ. Holds node information
const GW_GET_ALL_NODES_INFORMATION_FINISHED_NTF = 0x0205 // Acknowledge to GW_GET_ALL_NODES_INFORMATION_REQ. No more nodes.
const GW_SET_NODE_VARIATION_REQ = 0x0206 // Set node variation.
const GW_SET_NODE_VARIATION_CFM = 0x0207 // Acknowledge to GW_SET_NODE_VARIATION_REQ.
const GW_SET_NODE_NAME_REQ = 0x0208 // Set node name.
const GW_SET_NODE_NAME_CFM = 0x0209 // Acknowledge to GW_SET_NODE_NAME_REQ.
const GW_SET_NODE_VELOCITY_REQ = 0x020A // Set node velocity.
const GW_SET_NODE_VELOCITY_CFM = 0x020B // Acknowledge to GW_SET_NODE_VELOCITY_REQ.
const GW_NODE_INFORMATION_CHANGED_NTF = 0x020C // Information has been updated.
const GW_NODE_STATE_POSITION_CHANGED_NTF = 0x0211 // Information has been updated.
const GW_SET_NODE_ORDER_AND_PLACEMENT_REQ = 0x020D // Set search order and room placement.
const GW_SET_NODE_ORDER_AND_PLACEMENT_CFM = 0x020E // Acknowledge to GW_SET_NODE_ORDER_AND_PLACEMENT_REQ.

const GW_GET_GROUP_INFORMATION_REQ = 0x0220 // Request information about all defined groups.
const GW_GET_GROUP_INFORMATION_CFM = 0x0221 // Acknowledge to GW_GET_GROUP_INFORMATION_REQ.
const GW_GET_GROUP_INFORMATION_NTF = 0x0230 // Acknowledge to GW_GET_NODE_INFORMATION_REQ.
const GW_SET_GROUP_INFORMATION_REQ = 0x0222 // Change an existing group.
const GW_SET_GROUP_INFORMATION_CFM = 0x0223 // Acknowledge to GW_SET_GROUP_INFORMATION_REQ.
const GW_GROUP_INFORMATION_CHANGED_NTF = 0x0224 // Broadcast to all, about group information of a group has been changed.
const GW_DELETE_GROUP_REQ = 0x0225 // Delete a group.
const GW_DELETE_GROUP_CFM = 0x0226 // Acknowledge to GW_DELETE_GROUP_INFORMATION_REQ.
const GW_NEW_GROUP_REQ = 0x0227 // Request new group to be created.
0x0228 GW_NEW_GROUP_CFM
const GW_GET_ALL_GROUPS_INFORMATION_REQ = 0x0229 // Request information about all defined groups. 
const GW_GET_ALL_GROUPS_INFORMATION_CFM = 0x022A // Acknowledge to GW_GET_ALL_GROUPS_INFORMATION_REQ.
const GW_GET_ALL_GROUPS_INFORMATION_NTF = 0x022B // Acknowledge to GW_GET_ALL_GROUPS_INFORMATION_REQ.
const GW_GET_ALL_GROUPS_INFORMATION_FINISHED_NTF = 0x022C // Acknowledge to GW_GET_ALL_GROUPS_INFORMATION_REQ.
const GW_GROUP_DELETED_NTF = 0x022D // GW_GROUP_DELETED_NTF is broadcasted to all, when a group has been removed.
const GW_HOUSE_STATUS_MONITOR_ENABLE_REQ = 0x0240 // Enable house status monitor.
const GW_HOUSE_STATUS_MONITOR_ENABLE_CFM = 0x0241 // Acknowledge to GW_HOUSE_STATUS_MONITOR_ENABLE_REQ.
const GW_HOUSE_STATUS_MONITOR_DISABLE_REQ = 0x0242 // Disable house status monitor.
const GW_HOUSE_STATUS_MONITOR_DISABLE_CFM = 0x0243 // Acknowledge to GW_HOUSE_STATUS_MONITOR_DISABLE_REQ.

const GW_COMMAND_SEND_REQ = 0x0300 // Send activating command direct to one or more io-homecontrol® nodes.
const GW_COMMAND_SEND_CFM = 0x0301 // Acknowledge to GW_COMMAND_SEND_REQ.
const GW_COMMAND_RUN_STATUS_NTF = 0x0302 // Gives run status for io-homecontrol® node.
const GW_COMMAND_REMAINING_TIME_NTF = 0x0303 // Gives remaining time before io-homecontrol® node enter target position.
const GW_SESSION_FINISHED_NTF = 0x0304 // Command send, Status request, Wink, Mode or Stop session is finished.
const GW_STATUS_REQUEST_REQ = 0x0305 // Get status request from one or more io-homecontrol® nodes.
const GW_STATUS_REQUEST_CFM = 0x0306 // Acknowledge to GW_STATUS_REQUEST_REQ.
const GW_STATUS_REQUEST_NTF = 0x0307 // Acknowledge to GW_STATUS_REQUEST_REQ. Status request from one or more io-homecontrol® nodes.
const GW_WINK_SEND_REQ = 0x0308 // Request from one or more io-homecontrol® nodes to Wink.
const GW_WINK_SEND_CFM = 0x0309 // Acknowledge to GW_WINK_SEND_REQ
const GW_WINK_SEND_NTF = 0x030A // Status info for performed wink request.

const GW_SET_LIMITATION_REQ = 0x0310 // Set a parameter limitation in an actuator.
const GW_SET_LIMITATION_CFM = 0x0311 // Acknowledge to GW_SET_LIMITATION_REQ.
const GW_GET_LIMITATION_STATUS_REQ = 0x0312 // Get parameter limitation in an actuator.
const GW_GET_LIMITATION_STATUS_CFM = 0x0313 // Acknowledge to GW_GET_LIMITATION_STATUS_REQ.
const GW_LIMITATION_STATUS_NTF = 0x0314 // Hold information about limitation.
const GW_MODE_SEND_REQ = 0x0320 // Send Activate Mode to one or more io-homecontrol® nodes.
const GW_MODE_SEND_CFM = 0x0321 // Acknowledge to GW_MODE_SEND_REQ
const GW_MODE_SEND_NTF = 0x0322 // Notify with Mode activation info.
const GW_INITIALIZE_SCENE_REQ = 0x0400 // Prepare gateway to record a scene.
const GW_INITIALIZE_SCENE_CFM = 0x0401 // Acknowledge to GW_INITIALIZE_SCENE_REQ.
const GW_INITIALIZE_SCENE_NTF = 0x0402 // Acknowledge to GW_INITIALIZE_SCENE_REQ.
const GW_INITIALIZE_SCENE_CANCEL_REQ = 0x0403 // Cancel record scene process.
const GW_INITIALIZE_SCENE_CANCEL_CFM = 0x0404 // Acknowledge to GW_INITIALIZE_SCENE_CANCEL_REQ command.
const GW_RECORD_SCENE_REQ = 0x0405 // Store actuator positions changes since GW_INITIALIZE_SCENE, as a scene.
const GW_RECORD_SCENE_CFM = 0x0406 // Acknowledge to GW_RECORD_SCENE_REQ.
const GW_RECORD_SCENE_NTF = 0x0407 // Acknowledge to GW_RECORD_SCENE_REQ.
const GW_DELETE_SCENE_REQ = 0x0408 // Delete a recorded scene.
const GW_DELETE_SCENE_CFM = 0x0409 // Acknowledge to GW_DELETE_SCENE_REQ.
const GW_RENAME_SCENE_REQ = 0x040A // Request a scene to be renamed. 
const GW_RENAME_SCENE_CFM = 0x040B // Acknowledge to GW_RENAME_SCENE_REQ.
const GW_GET_SCENE_LIST_REQ = 0x040C // Request a list of scenes.
const GW_GET_SCENE_LIST_CFM = 0x040D // Acknowledge to GW_GET_SCENE_LIST.
const GW_GET_SCENE_LIST_NTF = 0x040E // Acknowledge to GW_GET_SCENE_LIST.
const GW_GET_SCENE_INFOAMATION_REQ = 0x040F // Request extended information for one given scene.
const GW_GET_SCENE_INFOAMATION_CFM = 0x0410 // Acknowledge to GW_GET_SCENE_INFOAMATION_REQ.
const GW_GET_SCENE_INFOAMATION_NTF = 0x0411 // Acknowledge to GW_GET_SCENE_INFOAMATION_REQ.
const GW_ACTIVATE_SCENE_REQ = 0x0412 // Request gateway to enter a scene.
const GW_ACTIVATE_SCENE_CFM = 0x0413 // Acknowledge to GW_ACTIVATE_SCENE_REQ.
const GW_STOP_SCENE_REQ = 0x0415 // Request all nodes in a given scene to stop at their current position.
const GW_STOP_SCENE_CFM = 0x0416 // Acknowledge to GW_STOP_SCENE_REQ.
const GW_SCENE_INFORMATION_CHANGED_NTF = 0x0419 // A scene has either been changed or removed.

const GW_ACTIVATE_PRODUCTGROUP_REQ = 0x0447 // Activate a product group in a given direction.
const GW_ACTIVATE_PRODUCTGROUP_CFM = 0x0448 // Acknowledge to GW_ACTIVATE_PRODUCTGROUP_REQ.
const GW_ACTIVATE_PRODUCTGROUP_NTF = 0x0449 // Acknowledge to GW_ACTIVATE_PRODUCTGROUP_REQ.

const GW_GET_CONTACT_INPUT_LINK_LIST_REQ = 0x0460 // Get list of assignments to all Contact Input to scene or product group.
const GW_GET_CONTACT_INPUT_LINK_LIST_CFM = 0x0461 // Acknowledge to GW_GET_CONTACT_INPUT_LINK_LIST_REQ.
const GW_SET_CONTACT_INPUT_LINK_REQ = 0x0462 // Set a link from a Contact Input to a scene or product group.
const GW_SET_CONTACT_INPUT_LINK_CFM = 0x0463 // Acknowledge to GW_SET_CONTACT_INPUT_LINK_REQ.
const GW_REMOVE_CONTACT_INPUT_LINK_REQ = 0x0464 // Remove a link from a Contact Input to a scene.
const GW_REMOVE_CONTACT_INPUT_LINK_CFM = 0x0465 // Acknowledge to GW_REMOVE_CONTACT_INPUT_LINK_REQ.

const GW_GET_ACTIVATION_LOG_HEADER_REQ = 0x0500 // Request header from activation log.
const GW_GET_ACTIVATION_LOG_HEADER_CFM = 0x0501 // Confirm header from activation log.
const GW_CLEAR_ACTIVATION_LOG_REQ = 0x0502 // Request clear all data in activation log.
const GW_CLEAR_ACTIVATION_LOG_CFM = 0x0503 // Confirm clear all data in activation log.
const GW_GET_ACTIVATION_LOG_LINE_REQ = 0x0504 // Request line from activation log.
const GW_GET_ACTIVATION_LOG_LINE_CFM = 0x0505 // Confirm line from activation log.
const GW_ACTIVATION_LOG_UPDATED_NTF = 0x0506 // Confirm line from activation log.
const GW_GET_MULTIPLE_ACTIVATION_LOG_LINES_REQ = 0x0507 // Request lines from activation log.
const GW_GET_MULTIPLE_ACTIVATION_LOG_LINES_NTF = 0x0508 // Error log data from activation log.
const GW_GET_MULTIPLE_ACTIVATION_LOG_LINES_CFM = 0x0509 // Confirm lines from activation log.

const GW_SET_UTC_REQ = 0x2000 // Request to set UTC time.
const GW_SET_UTC_CFM = 0x2001 // Acknowledge to GW_SET_UTC_REQ.
const GW_RTC_SET_TIME_ZONE_REQ = 0x2002 // Set time zone and daylight savings rules.
const GW_RTC_SET_TIME_ZONE_CFM = 0x2003 // Acknowledge to GW_RTC_SET_TIME_ZONE_REQ.
const GW_GET_LOCAL_TIME_REQ = 0x2004 // Request the local time based on current time zone and daylight savings rules.
const GW_GET_LOCAL_TIME_CFM = 0x2005 // Acknowledge to GW_RTC_SET_TIME_ZONE_REQ.

const GW_PASSWORD_ENTER_REQ = 0x3000 // Enter password to authenticate request
const GW_PASSWORD_ENTER_CFM = 0x3001 // Acknowledge to GW_PASSWORD_ENTER_REQ
const GW_PASSWORD_CHANGE_REQ = 0x3002 // Request password change.
const GW_PASSWORD_CHANGE_CFM = 0x3003 // Acknowledge to GW_PASSWORD_CHANGE_REQ.
const GW_PASSWORD_CHANGE_NTF = 0x3004 // Acknowledge to GW_PASSWORD_CHANGE_REQ. Broadcasted to all connected clients.
