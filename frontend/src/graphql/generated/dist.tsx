import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Query = {
  __typename?: 'Query';
  map: MapResponse;
  zerotierNetworks: ZerotierNetworkResponse;
  vpnData: VpnResponse;
  modemData: ModemResponse;
  nic: NicResponse;
  getUavcastInformation: VersionsRespons;
  getSupervisorInformation: VersionsRespons;
  getAvailableVersions: VerctlRespons;
  getApplication: ApplicationResponse;
  getEndpoints: EndpointResponse;
  flightController: FlightControllerResponse;
  getFileNames: LoggFilesResponse;
  getFileData: LoggDataResponse;
  getLoggData: LoggResponse;
  getLoggerParameters: LoggResponse;
  getTempLog: WinstonResponse;
  getNetworkLog: NetworkLoggDataResponse;
  getCpuLog: WinstonResponse;
  getServerLog: WinstonResponse;
  cameraData: CameraResponse;
};


export type QueryGetAvailableVersionsArgs = {
  application: Scalars['String'];
};


export type QueryGetFileDataArgs = {
  filename: Scalars['String'];
};


export type QueryGetTempLogArgs = {
  properties: LogProperties;
};


export type QueryGetNetworkLogArgs = {
  properties: LogProperties;
};


export type QueryGetCpuLogArgs = {
  properties: LogProperties;
};


export type QueryGetServerLogArgs = {
  properties: LogProperties;
};

export type MapResponse = {
  __typename?: 'MapResponse';
  mavCockpitDisable: Scalars['Boolean'];
};

export type ZerotierNetworkResponse = {
  __typename?: 'ZerotierNetworkResponse';
  networks?: Maybe<Array<ZerotierNetworkProperties>>;
  errors?: Maybe<Array<FieldError>>;
};

export type ZerotierNetworkProperties = {
  __typename?: 'ZerotierNetworkProperties';
  assignedAddresses: Array<Scalars['String']>;
  name: Scalars['String'];
  nwid: Scalars['String'];
  portDeviceName: Scalars['String'];
  status: Scalars['String'];
  type: Scalars['String'];
};

export type FieldError = {
  __typename?: 'FieldError';
  path?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};

export type VpnResponse = {
  __typename?: 'VpnResponse';
  data?: Maybe<Vpn>;
  errors?: Maybe<Array<FieldError>>;
};

export type Vpn = {
  __typename?: 'Vpn';
  id: Scalars['ID'];
  enableVpn: Scalars['Boolean'];
  networkId: Scalars['String'];
  serviceProvider: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
};

export type ModemResponse = {
  __typename?: 'ModemResponse';
  message?: Maybe<Modem>;
};

export type Modem = {
  __typename?: 'Modem';
  enableModem: Scalars['Boolean'];
  modemType: Scalars['String'];
  modemInformation: Scalars['Boolean'];
  modemInterface: Scalars['String'];
  internalAddress: Scalars['String'];
  pinCode: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
};

export type NicResponse = {
  __typename?: 'NicResponse';
  interfaces?: Maybe<Array<Scalars['String']>>;
};

export type VersionsRespons = {
  __typename?: 'VersionsRespons';
  message?: Maybe<Versions>;
  errors?: Maybe<Array<FieldError>>;
};

export type Versions = {
  __typename?: 'Versions';
  supervisor?: Maybe<VersionInformation>;
  uavcast?: Maybe<VersionInformation>;
};

export type VersionInformation = {
  __typename?: 'VersionInformation';
  repo: Scalars['String'];
  isRunning: Scalars['Boolean'];
  remoteVersion?: Maybe<Scalars['String']>;
  localVersion?: Maybe<Scalars['String']>;
  hasLatest?: Maybe<Scalars['Boolean']>;
  newVersionExsist?: Maybe<Scalars['Boolean']>;
};

export type VerctlRespons = {
  __typename?: 'VerctlRespons';
  count: Scalars['Float'];
  results: Array<Results>;
  error?: Maybe<Scalars['String']>;
};

export type Results = {
  __typename?: 'Results';
  id: Scalars['Float'];
  name: Scalars['String'];
  tag_status: Scalars['String'];
  last_updated: Scalars['String'];
  full_size: Scalars['String'];
};

export type ApplicationResponse = {
  __typename?: 'ApplicationResponse';
  properties?: Maybe<Application>;
  errors?: Maybe<Array<FieldError>>;
};

export type Application = {
  __typename?: 'Application';
  id: Scalars['ID'];
  remoteVersionFetched: Scalars['DateTime'];
  hasBeenUpdated: Scalars['Boolean'];
  webPort: Scalars['Float'];
};


export type EndpointResponse = {
  __typename?: 'EndpointResponse';
  data?: Maybe<Array<Endpoint>>;
  errors?: Maybe<Array<FieldError>>;
};

export type Endpoint = {
  __typename?: 'Endpoint';
  id: Scalars['ID'];
  telemEnable: Scalars['Boolean'];
  moduleActive: Scalars['Boolean'];
  name: Scalars['String'];
  endpointIPaddress: Scalars['String'];
  telemetryPort: Scalars['Float'];
  videoPort: Scalars['Float'];
  videoEnable: Scalars['Boolean'];
};

export type FlightControllerResponse = {
  __typename?: 'FlightControllerResponse';
  data?: Maybe<FlightController>;
  errors?: Maybe<Array<FieldError>>;
};

export type FlightController = {
  __typename?: 'FlightController';
  id: Scalars['ID'];
  controller: Scalars['String'];
  protocol: Scalars['String'];
  connectionType: Scalars['String'];
  internalAddress: Scalars['String'];
  baudRate: Scalars['String'];
  tcpPort: Scalars['String'];
  binFlightLog: Scalars['Boolean'];
};

export type LoggFilesResponse = {
  __typename?: 'LoggFilesResponse';
  files?: Maybe<Array<Scalars['String']>>;
  errors?: Maybe<Array<FieldError>>;
};

export type LoggDataResponse = {
  __typename?: 'LoggDataResponse';
  data?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<FieldError>>;
};

export type LoggResponse = {
  __typename?: 'LoggResponse';
  logs?: Maybe<Logger>;
  errors?: Maybe<Array<FieldError>>;
};

export type Logger = {
  __typename?: 'Logger';
  id: Scalars['ID'];
  debug: Scalars['Boolean'];
  resolution: Scalars['Float'];
  datetime: Scalars['DateTime'];
  logtemperature: Scalars['Boolean'];
  cellSignal: Scalars['Boolean'];
  satellites: Scalars['Boolean'];
  altitude: Scalars['Boolean'];
};

export type LogProperties = {
  minutes: Scalars['Float'];
  limit?: Maybe<Scalars['Float']>;
};

export type WinstonResponse = {
  __typename?: 'WinstonResponse';
  file?: Maybe<Array<WinstonProperties>>;
  errors?: Maybe<Array<FieldError>>;
};

export type WinstonProperties = {
  __typename?: 'WinstonProperties';
  timestamp: Scalars['String'];
  message?: Maybe<Scalars['String']>;
  data?: Maybe<Scalars['String']>;
  level?: Maybe<Scalars['String']>;
};

export type NetworkLoggDataResponse = {
  __typename?: 'NetworkLoggDataResponse';
  file?: Maybe<Array<NetworkLoggDataProperties>>;
  errors?: Maybe<Array<FieldError>>;
};

export type NetworkLoggDataProperties = {
  __typename?: 'NetworkLoggDataProperties';
  timestamp: Scalars['String'];
  message?: Maybe<Array<NetworkLoggDataPropertiesValues>>;
};

export type NetworkLoggDataPropertiesValues = {
  __typename?: 'NetworkLoggDataPropertiesValues';
  iface: Scalars['String'];
  rx_bytes: Scalars['Float'];
  tx_bytes: Scalars['Float'];
  rx_sec?: Maybe<Scalars['Float']>;
  tx_sec?: Maybe<Scalars['Float']>;
};

export type CameraResponse = {
  __typename?: 'CameraResponse';
  database?: Maybe<Camera>;
  availableCams?: Maybe<Array<AvailableCams>>;
};

export type Camera = {
  __typename?: 'Camera';
  id: Scalars['ID'];
  enableCamera: Scalars['Boolean'];
  key?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  path: Scalars['String'];
  protocol: Scalars['String'];
  resolution: Scalars['String'];
  customPipeline: Scalars['String'];
  framesPrSecond: Scalars['Float'];
  bitratePrSecond: Scalars['Float'];
  contrast: Scalars['Float'];
  rotation: Scalars['Float'];
  brightness: Scalars['Float'];
  whiteBalance: Scalars['String'];
  flipCamera: Scalars['String'];
  format: Scalars['String'];
};

export type AvailableCams = {
  __typename?: 'AvailableCams';
  key?: Maybe<Scalars['String']>;
  value: Scalars['String'];
  text: Scalars['String'];
  caps?: Maybe<Array<Caps>>;
};

export type Caps = {
  __typename?: 'Caps';
  value: Scalars['String'];
  text: Scalars['String'];
  height: Scalars['Float'];
  width: Scalars['Float'];
  format: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  sendMavCommand: Scalars['Boolean'];
  storeVpnValues: VpnResponse;
  uploadConfigFile: Scalars['Boolean'];
  childProcessCmd: KernelResponse;
  storeModemValues: ModemResponse;
  updateUavcastContainer: SupervisorRespons;
  updateSupervisorContainer: SupervisorRespons;
  supervisorCommands: Scalars['Boolean'];
  updateApplication: ApplicationResponse;
  addEndpoint: EndpointResponse;
  removeEndpoint: EndpointResponse;
  updateEndpoint: UpdateEndpointResponse;
  updateFlightController: FlightControllerResponse;
  resetFlightControllerDatabase: FlightControllerResponse;
  setLoggerParameters: LoggResponse;
  removeLogfile: Scalars['Boolean'];
  removeAllLogfiles: Scalars['Boolean'];
  getDockerLog: WinstonResponse;
  pruneLogFiles: Scalars['Boolean'];
  updateCamera: CameraResponse;
  cameraActions: CameraActionResponse;
  resetCameraDatabase: CameraResponse;
  uploadDatabaseFile: Scalars['Boolean'];
};


export type MutationSendMavCommandArgs = {
  type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};


export type MutationStoreVpnValuesArgs = {
  properties?: Maybe<VpnProperties>;
};


export type MutationUploadConfigFileArgs = {
  file: Scalars['Upload'];
};


export type MutationChildProcessCmdArgs = {
  cmd: Scalars['String'];
  shell?: Maybe<Scalars['Boolean']>;
  path: Scalars['String'];
};


export type MutationStoreModemValuesArgs = {
  properties?: Maybe<ModemProperties>;
};


export type MutationUpdateUavcastContainerArgs = {
  version?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  command?: Maybe<Scalars['String']>;
};


export type MutationUpdateSupervisorContainerArgs = {
  version?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  command?: Maybe<Scalars['String']>;
};


export type MutationSupervisorCommandsArgs = {
  version?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  command?: Maybe<Scalars['String']>;
};


export type MutationUpdateApplicationArgs = {
  properties: ApplicationProperties;
};


export type MutationRemoveEndpointArgs = {
  id?: Maybe<Scalars['String']>;
};


export type MutationUpdateEndpointArgs = {
  endpoint?: Maybe<EndpointProperties>;
};


export type MutationUpdateFlightControllerArgs = {
  fc?: Maybe<FcProperties>;
};


export type MutationSetLoggerParametersArgs = {
  parameters: LogParameters;
};


export type MutationRemoveLogfileArgs = {
  filename: Scalars['String'];
};


export type MutationGetDockerLogArgs = {
  properties: LogProperties;
};


export type MutationPruneLogFilesArgs = {
  service: Scalars['String'];
};


export type MutationUpdateCameraArgs = {
  properties?: Maybe<CameraProperties>;
};


export type MutationCameraActionsArgs = {
  properties?: Maybe<CameraActionProperties>;
};


export type MutationUploadDatabaseFileArgs = {
  file: Scalars['Upload'];
};

export type VpnProperties = {
  enableVpn?: Maybe<Scalars['Boolean']>;
  serviceProvider?: Maybe<Scalars['String']>;
  networkId?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
};


export type KernelResponse = {
  __typename?: 'KernelResponse';
  message?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<FieldError>>;
};

export type ModemProperties = {
  enableModem?: Maybe<Scalars['Boolean']>;
  modemType?: Maybe<Scalars['String']>;
  modemInformation?: Maybe<Scalars['Boolean']>;
  modemInterface?: Maybe<Scalars['String']>;
  internalAddress?: Maybe<Scalars['String']>;
  pinCode?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
};

export type SupervisorRespons = {
  __typename?: 'SupervisorRespons';
  message?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<FieldError>>;
};

export type ApplicationProperties = {
  id?: Maybe<Scalars['Float']>;
  remoteVersionFetched?: Maybe<Scalars['Boolean']>;
  hasBeenUpdated?: Maybe<Scalars['Boolean']>;
  webPort?: Maybe<Scalars['Float']>;
};

export type EndpointProperties = {
  id?: Maybe<Scalars['String']>;
  telemEnable?: Maybe<Scalars['Boolean']>;
  moduleActive?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  endpointIPaddress?: Maybe<Scalars['String']>;
  telemetryPort?: Maybe<Scalars['Float']>;
  videoPort?: Maybe<Scalars['Float']>;
  videoEnable?: Maybe<Scalars['Boolean']>;
};

export type UpdateEndpointResponse = {
  __typename?: 'UpdateEndpointResponse';
  data?: Maybe<Endpoint>;
  errors?: Maybe<Array<FieldError>>;
};

export type FcProperties = {
  controller?: Maybe<Scalars['String']>;
  protocol?: Maybe<Scalars['String']>;
  connectionType?: Maybe<Scalars['String']>;
  internalAddress?: Maybe<Scalars['String']>;
  baudRate?: Maybe<Scalars['String']>;
  tcpPort?: Maybe<Scalars['String']>;
  binFlightLog?: Maybe<Scalars['Boolean']>;
};

export type LogParameters = {
  debug?: Maybe<Scalars['Boolean']>;
  cellSignal?: Maybe<Scalars['Boolean']>;
  satellites?: Maybe<Scalars['Boolean']>;
  altitude?: Maybe<Scalars['Boolean']>;
  resolution?: Maybe<Scalars['Float']>;
};

export type CameraProperties = {
  controller?: Maybe<Scalars['String']>;
  protocol?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  resolution?: Maybe<Scalars['String']>;
  enableCamera?: Maybe<Scalars['Boolean']>;
  customPipeline?: Maybe<Scalars['String']>;
  customAddress?: Maybe<Scalars['String']>;
  framesPrSecond?: Maybe<Scalars['Float']>;
  bitratePrSecond?: Maybe<Scalars['Float']>;
  contrast?: Maybe<Scalars['Float']>;
  rotation?: Maybe<Scalars['Float']>;
  brightness?: Maybe<Scalars['Float']>;
  whiteBalance?: Maybe<Scalars['String']>;
  flipCamera?: Maybe<Scalars['String']>;
  format?: Maybe<Scalars['String']>;
};

export type CameraActionProperties = {
  playStream?: Maybe<Scalars['Boolean']>;
  stopStream?: Maybe<Scalars['Boolean']>;
};

export type CameraActionResponse = {
  __typename?: 'CameraActionResponse';
  playStream?: Maybe<Scalars['Boolean']>;
  stopStream?: Maybe<Scalars['Boolean']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  mavlink: MavlinkResponse;
  cmdAck: MavAckResponse;
  stdout: KernelResponse;
  supervisor: SupervisorRespons;
  status: StatusResponse;
  camera_stdout: KernelResponse;
};

export type MavlinkResponse = {
  __typename?: 'MavlinkResponse';
  message?: Maybe<MavMessage>;
};

export type MavMessage = {
  __typename?: 'MavMessage';
  heartbeat?: Maybe<HeartBeat>;
  vfr_hud?: Maybe<VfrHud>;
  power_status?: Maybe<PowerStatus>;
  failsafe?: Maybe<Failsafe>;
  gps_raw_int?: Maybe<GpsRawInt>;
};

export type HeartBeat = {
  __typename?: 'HeartBeat';
  armed?: Maybe<Scalars['Boolean']>;
  connected?: Maybe<Scalars['Boolean']>;
  firmware?: Maybe<Scalars['String']>;
  frame?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['Float']>;
  autopilot?: Maybe<Scalars['Float']>;
  base_mode?: Maybe<Scalars['Float']>;
  custom_mode?: Maybe<Scalars['Float']>;
  system_status?: Maybe<Scalars['Float']>;
  mavlink_version?: Maybe<Scalars['Float']>;
  numOfGcs?: Maybe<Array<NumOfGcs>>;
};

export type NumOfGcs = {
  __typename?: 'NumOfGcs';
  type?: Maybe<Scalars['Boolean']>;
};

export type VfrHud = {
  __typename?: 'VfrHud';
  airspeed?: Maybe<Scalars['Float']>;
  groundspeed?: Maybe<Scalars['Float']>;
  heading?: Maybe<Scalars['Float']>;
  throttle?: Maybe<Scalars['Float']>;
  alt?: Maybe<Scalars['Float']>;
  climb?: Maybe<Scalars['Float']>;
};

export type PowerStatus = {
  __typename?: 'PowerStatus';
  Vcc?: Maybe<Scalars['Float']>;
  Vservo?: Maybe<Scalars['Float']>;
  flags?: Maybe<Scalars['Float']>;
};

export type Failsafe = {
  __typename?: 'Failsafe';
  gcs?: Maybe<FailsafeGcs>;
  short?: Maybe<FailsafeGcs>;
  long?: Maybe<FailsafeGcs>;
};

export type FailsafeGcs = {
  __typename?: 'FailsafeGcs';
  param_value?: Maybe<Scalars['Float']>;
};

export type GpsRawInt = {
  __typename?: 'GpsRawInt';
  fix_type?: Maybe<Scalars['Float']>;
  lat?: Maybe<Scalars['Float']>;
  lon?: Maybe<Scalars['Float']>;
  alt?: Maybe<Scalars['Float']>;
  vel?: Maybe<Scalars['Float']>;
  cog?: Maybe<Scalars['Float']>;
  satellites_visible?: Maybe<Scalars['Float']>;
};

export type MavAckResponse = {
  __typename?: 'MavAckResponse';
  command?: Maybe<Scalars['Float']>;
  result?: Maybe<Scalars['Float']>;
  message?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<FieldError>>;
};

export type StatusResponse = {
  __typename?: 'StatusResponse';
  mavproxy?: Maybe<Scalars['Boolean']>;
  has_camera?: Maybe<Scalars['Boolean']>;
  video?: Maybe<Scalars['Boolean']>;
  modem?: Maybe<Scalars['Boolean']>;
  uavcast_systemd_active?: Maybe<Scalars['Boolean']>;
  uavcast_systemd_enabled?: Maybe<Scalars['Boolean']>;
  vpn?: Maybe<Scalars['Boolean']>;
  undervoltage?: Maybe<Scalars['Boolean']>;
  arch?: Maybe<Scalars['String']>;
};

export type TempLoggDataProperties = {
  __typename?: 'TempLoggDataProperties';
  timestamp: Scalars['String'];
  message: Scalars['String'];
};

export type TempLoggDataResponse = {
  __typename?: 'TempLoggDataResponse';
  file?: Maybe<Array<TempLoggDataProperties>>;
  errors?: Maybe<Array<FieldError>>;
};

export type MavlinkCommandInput = {
  type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type VpnInput = {
  properties?: Maybe<VpnProperties>;
};

export type ModemInput = {
  properties?: Maybe<ModemProperties>;
};

export type SupervisorInput = {
  version?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  command?: Maybe<Scalars['String']>;
};

export type GetApplicationVersionInput = {
  application: Scalars['String'];
};

export type ApplicationInput = {
  properties: ApplicationProperties;
};

export type EndpointInput = {
  endpoint?: Maybe<EndpointProperties>;
};

export type RemoveEndpointInput = {
  id?: Maybe<Scalars['String']>;
};

export type UpdateEndpointInput = {
  endpoint?: Maybe<EndpointProperties>;
};

export type FcInput = {
  fc?: Maybe<FcProperties>;
};

export type LogParametersInput = {
  parameters: LogParameters;
};

export type LogPeriodeInput = {
  properties: LogProperties;
};

export type DownloadLogProperties = {
  from?: Maybe<Scalars['Float']>;
  until?: Maybe<Scalars['Float']>;
  periode: Scalars['String'];
};

export type DownloadLogsInput = {
  properties: DownloadLogProperties;
};

export type PruneLogsInput = {
  service: Scalars['String'];
};

export type CameraInput = {
  properties?: Maybe<CameraProperties>;
};

export type CameraActionInput = {
  properties?: Maybe<CameraActionProperties>;
};

export type UpdateApplicationMutationVariables = Exact<{
  properties: ApplicationProperties;
}>;


export type UpdateApplicationMutation = (
  { __typename?: 'Mutation' }
  & { updateApplication: (
    { __typename?: 'ApplicationResponse' }
    & { properties?: Maybe<(
      { __typename?: 'Application' }
      & Pick<Application, 'id' | 'webPort'>
    )> }
  ) }
);

export type UploadDatabaseFileMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type UploadDatabaseFileMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'uploadDatabaseFile'>
);

export type UpdateCameraMutationVariables = Exact<{
  properties: CameraProperties;
}>;


export type UpdateCameraMutation = (
  { __typename?: 'Mutation' }
  & { updateCamera: (
    { __typename?: 'CameraResponse' }
    & { database?: Maybe<(
      { __typename?: 'Camera' }
      & Pick<Camera, 'id' | 'key' | 'name' | 'path' | 'protocol' | 'resolution' | 'enableCamera' | 'customPipeline' | 'framesPrSecond' | 'bitratePrSecond' | 'contrast' | 'rotation' | 'brightness' | 'whiteBalance' | 'flipCamera'>
    )>, availableCams?: Maybe<Array<(
      { __typename?: 'AvailableCams' }
      & Pick<AvailableCams, 'key' | 'value' | 'text'>
      & { caps?: Maybe<Array<(
        { __typename?: 'Caps' }
        & Pick<Caps, 'value' | 'text' | 'height' | 'width' | 'format'>
      )>> }
    )>> }
  ) }
);

export type ResetCameraDatabaseMutationVariables = Exact<{ [key: string]: never; }>;


export type ResetCameraDatabaseMutation = (
  { __typename?: 'Mutation' }
  & { resetCameraDatabase: (
    { __typename?: 'CameraResponse' }
    & { database?: Maybe<(
      { __typename?: 'Camera' }
      & Pick<Camera, 'id' | 'name' | 'key' | 'path' | 'protocol' | 'resolution' | 'enableCamera' | 'customPipeline' | 'framesPrSecond' | 'bitratePrSecond' | 'contrast' | 'rotation' | 'brightness' | 'whiteBalance' | 'flipCamera'>
    )>, availableCams?: Maybe<Array<(
      { __typename?: 'AvailableCams' }
      & Pick<AvailableCams, 'key' | 'value' | 'text'>
      & { caps?: Maybe<Array<(
        { __typename?: 'Caps' }
        & Pick<Caps, 'value' | 'text' | 'height' | 'width' | 'format'>
      )>> }
    )>> }
  ) }
);

export type CameraActionsMutationVariables = Exact<{
  properties: CameraActionProperties;
}>;


export type CameraActionsMutation = (
  { __typename?: 'Mutation' }
  & { cameraActions: (
    { __typename?: 'CameraActionResponse' }
    & Pick<CameraActionResponse, 'playStream' | 'stopStream'>
  ) }
);

export type AddEndpointMutationVariables = Exact<{ [key: string]: never; }>;


export type AddEndpointMutation = (
  { __typename?: 'Mutation' }
  & { addEndpoint: (
    { __typename?: 'EndpointResponse' }
    & { data?: Maybe<Array<(
      { __typename?: 'Endpoint' }
      & Pick<Endpoint, 'id' | 'telemEnable' | 'moduleActive' | 'name' | 'endpointIPaddress' | 'telemetryPort' | 'videoPort' | 'videoEnable'>
    )>> }
  ) }
);

export type RemoveEndpointMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type RemoveEndpointMutation = (
  { __typename?: 'Mutation' }
  & { removeEndpoint: (
    { __typename?: 'EndpointResponse' }
    & { data?: Maybe<Array<(
      { __typename?: 'Endpoint' }
      & Pick<Endpoint, 'id' | 'telemEnable' | 'moduleActive' | 'name' | 'endpointIPaddress' | 'telemetryPort' | 'videoPort' | 'videoEnable'>
    )>> }
  ) }
);

export type UpdateEndpointMutationVariables = Exact<{
  endpoint: EndpointProperties;
}>;


export type UpdateEndpointMutation = (
  { __typename?: 'Mutation' }
  & { updateEndpoint: (
    { __typename?: 'UpdateEndpointResponse' }
    & { data?: Maybe<(
      { __typename?: 'Endpoint' }
      & Pick<Endpoint, 'id' | 'telemEnable' | 'moduleActive' | 'name' | 'endpointIPaddress' | 'telemetryPort' | 'videoPort' | 'videoEnable'>
    )> }
  ) }
);

export type UpdateFlightControllerMutationVariables = Exact<{
  fc: FcProperties;
}>;


export type UpdateFlightControllerMutation = (
  { __typename?: 'Mutation' }
  & { updateFlightController: (
    { __typename?: 'FlightControllerResponse' }
    & { data?: Maybe<(
      { __typename?: 'FlightController' }
      & Pick<FlightController, 'id' | 'controller' | 'protocol' | 'connectionType' | 'internalAddress' | 'baudRate' | 'tcpPort' | 'binFlightLog'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'path' | 'message'>
    )>> }
  ) }
);

export type ResetFlightControllerDatabaseMutationVariables = Exact<{ [key: string]: never; }>;


export type ResetFlightControllerDatabaseMutation = (
  { __typename?: 'Mutation' }
  & { resetFlightControllerDatabase: (
    { __typename?: 'FlightControllerResponse' }
    & { data?: Maybe<(
      { __typename?: 'FlightController' }
      & Pick<FlightController, 'id' | 'controller' | 'protocol' | 'connectionType' | 'internalAddress' | 'baudRate' | 'tcpPort' | 'binFlightLog'>
    )> }
  ) }
);

export type ChildProcessCmdMutationVariables = Exact<{
  cmd: Scalars['String'];
  path: Scalars['String'];
  shell?: Maybe<Scalars['Boolean']>;
}>;


export type ChildProcessCmdMutation = (
  { __typename?: 'Mutation' }
  & { childProcessCmd: (
    { __typename?: 'KernelResponse' }
    & Pick<KernelResponse, 'message'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'path' | 'message'>
    )>> }
  ) }
);

export type RemoveLogfileMutationVariables = Exact<{
  filename: Scalars['String'];
}>;


export type RemoveLogfileMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'removeLogfile'>
);

export type RemoveAllLogfilesMutationVariables = Exact<{ [key: string]: never; }>;


export type RemoveAllLogfilesMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'removeAllLogfiles'>
);

export type PruneLogFilesMutationVariables = Exact<{
  service: Scalars['String'];
}>;


export type PruneLogFilesMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'pruneLogFiles'>
);

export type SetLoggerParametersMutationVariables = Exact<{
  parameters: LogParameters;
}>;


export type SetLoggerParametersMutation = (
  { __typename?: 'Mutation' }
  & { setLoggerParameters: (
    { __typename?: 'LoggResponse' }
    & { logs?: Maybe<(
      { __typename?: 'Logger' }
      & Pick<Logger, 'id' | 'debug' | 'cellSignal' | 'satellites' | 'altitude' | 'resolution'>
    )> }
  ) }
);

export type GetDockerLogMutationVariables = Exact<{
  properties: LogProperties;
}>;


export type GetDockerLogMutation = (
  { __typename?: 'Mutation' }
  & { getDockerLog: (
    { __typename?: 'WinstonResponse' }
    & { file?: Maybe<Array<(
      { __typename?: 'WinstonProperties' }
      & Pick<WinstonProperties, 'timestamp' | 'message' | 'data' | 'level'>
    )>> }
  ) }
);

export type SendMavCommandMutationVariables = Exact<{
  type: Scalars['String'];
  value: Scalars['String'];
}>;


export type SendMavCommandMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'sendMavCommand'>
);

export type StoreModemValuesMutationVariables = Exact<{
  properties: ModemProperties;
}>;


export type StoreModemValuesMutation = (
  { __typename?: 'Mutation' }
  & { storeModemValues: (
    { __typename?: 'ModemResponse' }
    & { message?: Maybe<(
      { __typename?: 'Modem' }
      & Pick<Modem, 'modemType' | 'modemInformation'>
    )> }
  ) }
);

export type UpdateUavcastContainerMutationVariables = Exact<{
  version: Scalars['String'];
}>;


export type UpdateUavcastContainerMutation = (
  { __typename?: 'Mutation' }
  & { updateUavcastContainer: (
    { __typename?: 'SupervisorRespons' }
    & Pick<SupervisorRespons, 'message'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'message' | 'path'>
    )>> }
  ) }
);

export type UpdateSupervisorContainerMutationVariables = Exact<{
  version: Scalars['String'];
}>;


export type UpdateSupervisorContainerMutation = (
  { __typename?: 'Mutation' }
  & { updateSupervisorContainer: (
    { __typename?: 'SupervisorRespons' }
    & Pick<SupervisorRespons, 'message'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'message' | 'path'>
    )>> }
  ) }
);

export type SupervisorCommandsMutationVariables = Exact<{
  type: Scalars['String'];
  command?: Maybe<Scalars['String']>;
}>;


export type SupervisorCommandsMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'supervisorCommands'>
);

export type StoreVpnValuesMutationVariables = Exact<{
  properties: VpnProperties;
}>;


export type StoreVpnValuesMutation = (
  { __typename?: 'Mutation' }
  & { storeVpnValues: (
    { __typename?: 'VpnResponse' }
    & { data?: Maybe<(
      { __typename?: 'Vpn' }
      & Pick<Vpn, 'id' | 'enableVpn' | 'serviceProvider' | 'networkId' | 'username' | 'password'>
    )> }
  ) }
);

export type UploadConfigFileMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type UploadConfigFileMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'uploadConfigFile'>
);

export type GetApplicationQueryVariables = Exact<{ [key: string]: never; }>;


export type GetApplicationQuery = (
  { __typename?: 'Query' }
  & { getApplication: (
    { __typename?: 'ApplicationResponse' }
    & { properties?: Maybe<(
      { __typename?: 'Application' }
      & Pick<Application, 'webPort'>
    )> }
  ) }
);

export type CameraDataQueryVariables = Exact<{ [key: string]: never; }>;


export type CameraDataQuery = (
  { __typename?: 'Query' }
  & { cameraData: (
    { __typename?: 'CameraResponse' }
    & { database?: Maybe<(
      { __typename?: 'Camera' }
      & Pick<Camera, 'id' | 'key' | 'name' | 'path' | 'protocol' | 'resolution' | 'enableCamera' | 'customPipeline' | 'framesPrSecond' | 'bitratePrSecond' | 'contrast' | 'rotation' | 'brightness' | 'whiteBalance' | 'flipCamera'>
    )>, availableCams?: Maybe<Array<(
      { __typename?: 'AvailableCams' }
      & Pick<AvailableCams, 'key' | 'value' | 'text'>
      & { caps?: Maybe<Array<(
        { __typename?: 'Caps' }
        & Pick<Caps, 'value' | 'text' | 'height' | 'width' | 'format'>
      )>> }
    )>> }
  ) }
);

export type GetEndpointsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEndpointsQuery = (
  { __typename?: 'Query' }
  & { getEndpoints: (
    { __typename?: 'EndpointResponse' }
    & { data?: Maybe<Array<(
      { __typename?: 'Endpoint' }
      & Pick<Endpoint, 'id' | 'telemEnable' | 'moduleActive' | 'name' | 'endpointIPaddress' | 'telemetryPort' | 'videoPort' | 'videoEnable'>
    )>> }
  ) }
);

export type FlightControllerQueryVariables = Exact<{ [key: string]: never; }>;


export type FlightControllerQuery = (
  { __typename?: 'Query' }
  & { flightController: (
    { __typename?: 'FlightControllerResponse' }
    & { data?: Maybe<(
      { __typename?: 'FlightController' }
      & Pick<FlightController, 'id' | 'controller' | 'protocol' | 'connectionType' | 'internalAddress' | 'baudRate' | 'tcpPort' | 'binFlightLog'>
    )> }
  ) }
);

export type GetFileNamesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFileNamesQuery = (
  { __typename?: 'Query' }
  & { getFileNames: (
    { __typename?: 'LoggFilesResponse' }
    & Pick<LoggFilesResponse, 'files'>
  ) }
);

export type GetFileDataQueryVariables = Exact<{
  filename: Scalars['String'];
}>;


export type GetFileDataQuery = (
  { __typename?: 'Query' }
  & { getFileData: (
    { __typename?: 'LoggDataResponse' }
    & Pick<LoggDataResponse, 'data'>
  ) }
);

export type GetTempLogQueryVariables = Exact<{
  properties: LogProperties;
}>;


export type GetTempLogQuery = (
  { __typename?: 'Query' }
  & { getTempLog: (
    { __typename?: 'WinstonResponse' }
    & { file?: Maybe<Array<(
      { __typename?: 'WinstonProperties' }
      & Pick<WinstonProperties, 'message' | 'timestamp'>
    )>> }
  ) }
);

export type GetNetworkLogQueryVariables = Exact<{
  properties: LogProperties;
}>;


export type GetNetworkLogQuery = (
  { __typename?: 'Query' }
  & { getNetworkLog: (
    { __typename?: 'NetworkLoggDataResponse' }
    & { file?: Maybe<Array<(
      { __typename?: 'NetworkLoggDataProperties' }
      & Pick<NetworkLoggDataProperties, 'timestamp'>
      & { message?: Maybe<Array<(
        { __typename?: 'NetworkLoggDataPropertiesValues' }
        & Pick<NetworkLoggDataPropertiesValues, 'iface' | 'rx_bytes' | 'tx_bytes' | 'rx_sec' | 'tx_sec'>
      )>> }
    )>> }
  ) }
);

export type GetServerLogQueryVariables = Exact<{
  properties: LogProperties;
}>;


export type GetServerLogQuery = (
  { __typename?: 'Query' }
  & { getServerLog: (
    { __typename?: 'WinstonResponse' }
    & { file?: Maybe<Array<(
      { __typename?: 'WinstonProperties' }
      & Pick<WinstonProperties, 'timestamp' | 'message' | 'data' | 'level'>
    )>> }
  ) }
);

export type GetCpuLogQueryVariables = Exact<{
  properties: LogProperties;
}>;


export type GetCpuLogQuery = (
  { __typename?: 'Query' }
  & { getCpuLog: (
    { __typename?: 'WinstonResponse' }
    & { file?: Maybe<Array<(
      { __typename?: 'WinstonProperties' }
      & Pick<WinstonProperties, 'timestamp' | 'message'>
    )>> }
  ) }
);

export type GetLoggerParametersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLoggerParametersQuery = (
  { __typename?: 'Query' }
  & { getLoggerParameters: (
    { __typename?: 'LoggResponse' }
    & { logs?: Maybe<(
      { __typename?: 'Logger' }
      & Pick<Logger, 'id' | 'debug' | 'cellSignal' | 'satellites' | 'altitude' | 'resolution'>
    )> }
  ) }
);

export type MapQueryVariables = Exact<{ [key: string]: never; }>;


export type MapQuery = (
  { __typename?: 'Query' }
  & { map: (
    { __typename?: 'MapResponse' }
    & Pick<MapResponse, 'mavCockpitDisable'>
  ) }
);

export type ModemDataQueryVariables = Exact<{ [key: string]: never; }>;


export type ModemDataQuery = (
  { __typename?: 'Query' }
  & { modemData: (
    { __typename?: 'ModemResponse' }
    & { message?: Maybe<(
      { __typename?: 'Modem' }
      & Pick<Modem, 'modemType' | 'modemInformation' | 'modemInterface' | 'enableModem' | 'internalAddress' | 'pinCode' | 'username' | 'password'>
    )> }
  ) }
);

export type NicQueryVariables = Exact<{ [key: string]: never; }>;


export type NicQuery = (
  { __typename?: 'Query' }
  & { nic: (
    { __typename?: 'NicResponse' }
    & Pick<NicResponse, 'interfaces'>
  ) }
);

export type GetAvailableVersionsQueryVariables = Exact<{
  application: Scalars['String'];
}>;


export type GetAvailableVersionsQuery = (
  { __typename?: 'Query' }
  & { getAvailableVersions: (
    { __typename?: 'VerctlRespons' }
    & Pick<VerctlRespons, 'count' | 'error'>
    & { results: Array<(
      { __typename?: 'Results' }
      & Pick<Results, 'id' | 'name' | 'tag_status' | 'last_updated' | 'full_size'>
    )> }
  ) }
);

export type GetUavcastInformationQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUavcastInformationQuery = (
  { __typename?: 'Query' }
  & { getUavcastInformation: (
    { __typename?: 'VersionsRespons' }
    & { message?: Maybe<(
      { __typename?: 'Versions' }
      & { supervisor?: Maybe<(
        { __typename?: 'VersionInformation' }
        & Pick<VersionInformation, 'repo' | 'isRunning' | 'remoteVersion' | 'localVersion' | 'hasLatest' | 'newVersionExsist'>
      )>, uavcast?: Maybe<(
        { __typename?: 'VersionInformation' }
        & Pick<VersionInformation, 'repo' | 'isRunning' | 'remoteVersion' | 'localVersion' | 'hasLatest' | 'newVersionExsist'>
      )> }
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'path' | 'message'>
    )>> }
  ) }
);

export type GetSupervisorInformationQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSupervisorInformationQuery = (
  { __typename?: 'Query' }
  & { getSupervisorInformation: (
    { __typename?: 'VersionsRespons' }
    & { message?: Maybe<(
      { __typename?: 'Versions' }
      & { supervisor?: Maybe<(
        { __typename?: 'VersionInformation' }
        & Pick<VersionInformation, 'repo' | 'isRunning' | 'remoteVersion' | 'localVersion' | 'hasLatest' | 'newVersionExsist'>
      )>, uavcast?: Maybe<(
        { __typename?: 'VersionInformation' }
        & Pick<VersionInformation, 'repo' | 'isRunning' | 'remoteVersion' | 'localVersion' | 'hasLatest' | 'newVersionExsist'>
      )> }
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'path' | 'message'>
    )>> }
  ) }
);

export type VpnDataQueryVariables = Exact<{ [key: string]: never; }>;


export type VpnDataQuery = (
  { __typename?: 'Query' }
  & { vpnData: (
    { __typename?: 'VpnResponse' }
    & { data?: Maybe<(
      { __typename?: 'Vpn' }
      & Pick<Vpn, 'id' | 'enableVpn' | 'serviceProvider' | 'networkId' | 'username' | 'password'>
    )> }
  ) }
);

export type ZerotierNetworksQueryVariables = Exact<{ [key: string]: never; }>;


export type ZerotierNetworksQuery = (
  { __typename?: 'Query' }
  & { zerotierNetworks: (
    { __typename?: 'ZerotierNetworkResponse' }
    & { networks?: Maybe<Array<(
      { __typename?: 'ZerotierNetworkProperties' }
      & Pick<ZerotierNetworkProperties, 'assignedAddresses' | 'name' | 'nwid' | 'portDeviceName' | 'status' | 'type'>
    )>> }
  ) }
);

export type Camera_StdoutSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type Camera_StdoutSubscription = (
  { __typename?: 'Subscription' }
  & { camera_stdout: (
    { __typename?: 'KernelResponse' }
    & Pick<KernelResponse, 'message'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'path' | 'message'>
    )>> }
  ) }
);

export type StatusSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type StatusSubscription = (
  { __typename?: 'Subscription' }
  & { status: (
    { __typename?: 'StatusResponse' }
    & Pick<StatusResponse, 'mavproxy' | 'has_camera' | 'video' | 'modem' | 'uavcast_systemd_active' | 'uavcast_systemd_enabled' | 'vpn' | 'undervoltage' | 'arch'>
  ) }
);

export type MavlinkSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type MavlinkSubscription = (
  { __typename?: 'Subscription' }
  & { mavlink: (
    { __typename?: 'MavlinkResponse' }
    & { message?: Maybe<(
      { __typename?: 'MavMessage' }
      & { heartbeat?: Maybe<(
        { __typename?: 'HeartBeat' }
        & Pick<HeartBeat, 'armed' | 'connected' | 'type' | 'autopilot' | 'base_mode' | 'custom_mode' | 'system_status' | 'mavlink_version' | 'firmware' | 'frame'>
        & { numOfGcs?: Maybe<Array<(
          { __typename?: 'NumOfGcs' }
          & Pick<NumOfGcs, 'type'>
        )>> }
      )>, vfr_hud?: Maybe<(
        { __typename?: 'VfrHud' }
        & Pick<VfrHud, 'airspeed' | 'groundspeed' | 'heading' | 'throttle' | 'alt' | 'climb'>
      )>, power_status?: Maybe<(
        { __typename?: 'PowerStatus' }
        & Pick<PowerStatus, 'Vcc' | 'Vservo' | 'flags'>
      )>, failsafe?: Maybe<(
        { __typename?: 'Failsafe' }
        & { gcs?: Maybe<(
          { __typename?: 'FailsafeGcs' }
          & Pick<FailsafeGcs, 'param_value'>
        )>, short?: Maybe<(
          { __typename?: 'FailsafeGcs' }
          & Pick<FailsafeGcs, 'param_value'>
        )>, long?: Maybe<(
          { __typename?: 'FailsafeGcs' }
          & Pick<FailsafeGcs, 'param_value'>
        )> }
      )>, gps_raw_int?: Maybe<(
        { __typename?: 'GpsRawInt' }
        & Pick<GpsRawInt, 'fix_type' | 'lat' | 'lon' | 'alt' | 'vel' | 'cog' | 'satellites_visible'>
      )> }
    )> }
  ) }
);

export type CmdAckSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CmdAckSubscription = (
  { __typename?: 'Subscription' }
  & { cmdAck: (
    { __typename?: 'MavAckResponse' }
    & Pick<MavAckResponse, 'command' | 'result' | 'message'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'path' | 'message'>
    )>> }
  ) }
);

export type StdoutSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type StdoutSubscription = (
  { __typename?: 'Subscription' }
  & { stdout: (
    { __typename?: 'KernelResponse' }
    & Pick<KernelResponse, 'message'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'path' | 'message'>
    )>> }
  ) }
);

export type SupervisorSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type SupervisorSubscription = (
  { __typename?: 'Subscription' }
  & { supervisor: (
    { __typename?: 'SupervisorRespons' }
    & Pick<SupervisorRespons, 'message'>
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'path' | 'message'>
    )>> }
  ) }
);


export const UpdateApplicationDocument = gql`
    mutation updateApplication($properties: ApplicationProperties!) {
  updateApplication(properties: $properties) {
    properties {
      id
      webPort
    }
  }
}
    `;
export type UpdateApplicationMutationFn = Apollo.MutationFunction<UpdateApplicationMutation, UpdateApplicationMutationVariables>;

/**
 * __useUpdateApplicationMutation__
 *
 * To run a mutation, you first call `useUpdateApplicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateApplicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateApplicationMutation, { data, loading, error }] = useUpdateApplicationMutation({
 *   variables: {
 *      properties: // value for 'properties'
 *   },
 * });
 */
export function useUpdateApplicationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateApplicationMutation, UpdateApplicationMutationVariables>) {
        return Apollo.useMutation<UpdateApplicationMutation, UpdateApplicationMutationVariables>(UpdateApplicationDocument, baseOptions);
      }
export type UpdateApplicationMutationHookResult = ReturnType<typeof useUpdateApplicationMutation>;
export type UpdateApplicationMutationResult = Apollo.MutationResult<UpdateApplicationMutation>;
export type UpdateApplicationMutationOptions = Apollo.BaseMutationOptions<UpdateApplicationMutation, UpdateApplicationMutationVariables>;
export const UploadDatabaseFileDocument = gql`
    mutation uploadDatabaseFile($file: Upload!) {
  uploadDatabaseFile(file: $file)
}
    `;
export type UploadDatabaseFileMutationFn = Apollo.MutationFunction<UploadDatabaseFileMutation, UploadDatabaseFileMutationVariables>;

/**
 * __useUploadDatabaseFileMutation__
 *
 * To run a mutation, you first call `useUploadDatabaseFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadDatabaseFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadDatabaseFileMutation, { data, loading, error }] = useUploadDatabaseFileMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadDatabaseFileMutation(baseOptions?: Apollo.MutationHookOptions<UploadDatabaseFileMutation, UploadDatabaseFileMutationVariables>) {
        return Apollo.useMutation<UploadDatabaseFileMutation, UploadDatabaseFileMutationVariables>(UploadDatabaseFileDocument, baseOptions);
      }
export type UploadDatabaseFileMutationHookResult = ReturnType<typeof useUploadDatabaseFileMutation>;
export type UploadDatabaseFileMutationResult = Apollo.MutationResult<UploadDatabaseFileMutation>;
export type UploadDatabaseFileMutationOptions = Apollo.BaseMutationOptions<UploadDatabaseFileMutation, UploadDatabaseFileMutationVariables>;
export const UpdateCameraDocument = gql`
    mutation updateCamera($properties: CameraProperties!) {
  updateCamera(properties: $properties) {
    database {
      id
      key
      name
      path
      protocol
      resolution
      enableCamera
      customPipeline
      framesPrSecond
      bitratePrSecond
      contrast
      rotation
      brightness
      whiteBalance
      flipCamera
    }
    availableCams {
      key
      value
      text
      caps {
        value
        text
        height
        width
        format
      }
    }
  }
}
    `;
export type UpdateCameraMutationFn = Apollo.MutationFunction<UpdateCameraMutation, UpdateCameraMutationVariables>;

/**
 * __useUpdateCameraMutation__
 *
 * To run a mutation, you first call `useUpdateCameraMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCameraMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCameraMutation, { data, loading, error }] = useUpdateCameraMutation({
 *   variables: {
 *      properties: // value for 'properties'
 *   },
 * });
 */
export function useUpdateCameraMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCameraMutation, UpdateCameraMutationVariables>) {
        return Apollo.useMutation<UpdateCameraMutation, UpdateCameraMutationVariables>(UpdateCameraDocument, baseOptions);
      }
export type UpdateCameraMutationHookResult = ReturnType<typeof useUpdateCameraMutation>;
export type UpdateCameraMutationResult = Apollo.MutationResult<UpdateCameraMutation>;
export type UpdateCameraMutationOptions = Apollo.BaseMutationOptions<UpdateCameraMutation, UpdateCameraMutationVariables>;
export const ResetCameraDatabaseDocument = gql`
    mutation resetCameraDatabase {
  resetCameraDatabase {
    database {
      id
      name
      key
      path
      protocol
      resolution
      enableCamera
      customPipeline
      framesPrSecond
      bitratePrSecond
      contrast
      rotation
      brightness
      whiteBalance
      flipCamera
    }
    availableCams {
      key
      value
      text
      caps {
        value
        text
        height
        width
        format
      }
    }
  }
}
    `;
export type ResetCameraDatabaseMutationFn = Apollo.MutationFunction<ResetCameraDatabaseMutation, ResetCameraDatabaseMutationVariables>;

/**
 * __useResetCameraDatabaseMutation__
 *
 * To run a mutation, you first call `useResetCameraDatabaseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetCameraDatabaseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetCameraDatabaseMutation, { data, loading, error }] = useResetCameraDatabaseMutation({
 *   variables: {
 *   },
 * });
 */
export function useResetCameraDatabaseMutation(baseOptions?: Apollo.MutationHookOptions<ResetCameraDatabaseMutation, ResetCameraDatabaseMutationVariables>) {
        return Apollo.useMutation<ResetCameraDatabaseMutation, ResetCameraDatabaseMutationVariables>(ResetCameraDatabaseDocument, baseOptions);
      }
export type ResetCameraDatabaseMutationHookResult = ReturnType<typeof useResetCameraDatabaseMutation>;
export type ResetCameraDatabaseMutationResult = Apollo.MutationResult<ResetCameraDatabaseMutation>;
export type ResetCameraDatabaseMutationOptions = Apollo.BaseMutationOptions<ResetCameraDatabaseMutation, ResetCameraDatabaseMutationVariables>;
export const CameraActionsDocument = gql`
    mutation cameraActions($properties: CameraActionProperties!) {
  cameraActions(properties: $properties) {
    playStream
    stopStream
  }
}
    `;
export type CameraActionsMutationFn = Apollo.MutationFunction<CameraActionsMutation, CameraActionsMutationVariables>;

/**
 * __useCameraActionsMutation__
 *
 * To run a mutation, you first call `useCameraActionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCameraActionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cameraActionsMutation, { data, loading, error }] = useCameraActionsMutation({
 *   variables: {
 *      properties: // value for 'properties'
 *   },
 * });
 */
export function useCameraActionsMutation(baseOptions?: Apollo.MutationHookOptions<CameraActionsMutation, CameraActionsMutationVariables>) {
        return Apollo.useMutation<CameraActionsMutation, CameraActionsMutationVariables>(CameraActionsDocument, baseOptions);
      }
export type CameraActionsMutationHookResult = ReturnType<typeof useCameraActionsMutation>;
export type CameraActionsMutationResult = Apollo.MutationResult<CameraActionsMutation>;
export type CameraActionsMutationOptions = Apollo.BaseMutationOptions<CameraActionsMutation, CameraActionsMutationVariables>;
export const AddEndpointDocument = gql`
    mutation addEndpoint {
  addEndpoint {
    data {
      id
      telemEnable
      moduleActive
      name
      endpointIPaddress
      telemetryPort
      videoPort
      videoEnable
    }
  }
}
    `;
export type AddEndpointMutationFn = Apollo.MutationFunction<AddEndpointMutation, AddEndpointMutationVariables>;

/**
 * __useAddEndpointMutation__
 *
 * To run a mutation, you first call `useAddEndpointMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddEndpointMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addEndpointMutation, { data, loading, error }] = useAddEndpointMutation({
 *   variables: {
 *   },
 * });
 */
export function useAddEndpointMutation(baseOptions?: Apollo.MutationHookOptions<AddEndpointMutation, AddEndpointMutationVariables>) {
        return Apollo.useMutation<AddEndpointMutation, AddEndpointMutationVariables>(AddEndpointDocument, baseOptions);
      }
export type AddEndpointMutationHookResult = ReturnType<typeof useAddEndpointMutation>;
export type AddEndpointMutationResult = Apollo.MutationResult<AddEndpointMutation>;
export type AddEndpointMutationOptions = Apollo.BaseMutationOptions<AddEndpointMutation, AddEndpointMutationVariables>;
export const RemoveEndpointDocument = gql`
    mutation removeEndpoint($id: String!) {
  removeEndpoint(id: $id) {
    data {
      id
      telemEnable
      moduleActive
      name
      endpointIPaddress
      telemetryPort
      videoPort
      videoEnable
    }
  }
}
    `;
export type RemoveEndpointMutationFn = Apollo.MutationFunction<RemoveEndpointMutation, RemoveEndpointMutationVariables>;

/**
 * __useRemoveEndpointMutation__
 *
 * To run a mutation, you first call `useRemoveEndpointMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveEndpointMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeEndpointMutation, { data, loading, error }] = useRemoveEndpointMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveEndpointMutation(baseOptions?: Apollo.MutationHookOptions<RemoveEndpointMutation, RemoveEndpointMutationVariables>) {
        return Apollo.useMutation<RemoveEndpointMutation, RemoveEndpointMutationVariables>(RemoveEndpointDocument, baseOptions);
      }
export type RemoveEndpointMutationHookResult = ReturnType<typeof useRemoveEndpointMutation>;
export type RemoveEndpointMutationResult = Apollo.MutationResult<RemoveEndpointMutation>;
export type RemoveEndpointMutationOptions = Apollo.BaseMutationOptions<RemoveEndpointMutation, RemoveEndpointMutationVariables>;
export const UpdateEndpointDocument = gql`
    mutation updateEndpoint($endpoint: EndpointProperties!) {
  updateEndpoint(endpoint: $endpoint) {
    data {
      id
      telemEnable
      moduleActive
      name
      endpointIPaddress
      telemetryPort
      videoPort
      videoEnable
    }
  }
}
    `;
export type UpdateEndpointMutationFn = Apollo.MutationFunction<UpdateEndpointMutation, UpdateEndpointMutationVariables>;

/**
 * __useUpdateEndpointMutation__
 *
 * To run a mutation, you first call `useUpdateEndpointMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEndpointMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEndpointMutation, { data, loading, error }] = useUpdateEndpointMutation({
 *   variables: {
 *      endpoint: // value for 'endpoint'
 *   },
 * });
 */
export function useUpdateEndpointMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEndpointMutation, UpdateEndpointMutationVariables>) {
        return Apollo.useMutation<UpdateEndpointMutation, UpdateEndpointMutationVariables>(UpdateEndpointDocument, baseOptions);
      }
export type UpdateEndpointMutationHookResult = ReturnType<typeof useUpdateEndpointMutation>;
export type UpdateEndpointMutationResult = Apollo.MutationResult<UpdateEndpointMutation>;
export type UpdateEndpointMutationOptions = Apollo.BaseMutationOptions<UpdateEndpointMutation, UpdateEndpointMutationVariables>;
export const UpdateFlightControllerDocument = gql`
    mutation updateFlightController($fc: FcProperties!) {
  updateFlightController(fc: $fc) {
    data {
      id
      controller
      protocol
      connectionType
      internalAddress
      baudRate
      tcpPort
      binFlightLog
    }
    errors {
      path
      message
    }
  }
}
    `;
export type UpdateFlightControllerMutationFn = Apollo.MutationFunction<UpdateFlightControllerMutation, UpdateFlightControllerMutationVariables>;

/**
 * __useUpdateFlightControllerMutation__
 *
 * To run a mutation, you first call `useUpdateFlightControllerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFlightControllerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFlightControllerMutation, { data, loading, error }] = useUpdateFlightControllerMutation({
 *   variables: {
 *      fc: // value for 'fc'
 *   },
 * });
 */
export function useUpdateFlightControllerMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFlightControllerMutation, UpdateFlightControllerMutationVariables>) {
        return Apollo.useMutation<UpdateFlightControllerMutation, UpdateFlightControllerMutationVariables>(UpdateFlightControllerDocument, baseOptions);
      }
export type UpdateFlightControllerMutationHookResult = ReturnType<typeof useUpdateFlightControllerMutation>;
export type UpdateFlightControllerMutationResult = Apollo.MutationResult<UpdateFlightControllerMutation>;
export type UpdateFlightControllerMutationOptions = Apollo.BaseMutationOptions<UpdateFlightControllerMutation, UpdateFlightControllerMutationVariables>;
export const ResetFlightControllerDatabaseDocument = gql`
    mutation resetFlightControllerDatabase {
  resetFlightControllerDatabase {
    data {
      id
      controller
      protocol
      connectionType
      internalAddress
      baudRate
      tcpPort
      binFlightLog
    }
  }
}
    `;
export type ResetFlightControllerDatabaseMutationFn = Apollo.MutationFunction<ResetFlightControllerDatabaseMutation, ResetFlightControllerDatabaseMutationVariables>;

/**
 * __useResetFlightControllerDatabaseMutation__
 *
 * To run a mutation, you first call `useResetFlightControllerDatabaseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetFlightControllerDatabaseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetFlightControllerDatabaseMutation, { data, loading, error }] = useResetFlightControllerDatabaseMutation({
 *   variables: {
 *   },
 * });
 */
export function useResetFlightControllerDatabaseMutation(baseOptions?: Apollo.MutationHookOptions<ResetFlightControllerDatabaseMutation, ResetFlightControllerDatabaseMutationVariables>) {
        return Apollo.useMutation<ResetFlightControllerDatabaseMutation, ResetFlightControllerDatabaseMutationVariables>(ResetFlightControllerDatabaseDocument, baseOptions);
      }
export type ResetFlightControllerDatabaseMutationHookResult = ReturnType<typeof useResetFlightControllerDatabaseMutation>;
export type ResetFlightControllerDatabaseMutationResult = Apollo.MutationResult<ResetFlightControllerDatabaseMutation>;
export type ResetFlightControllerDatabaseMutationOptions = Apollo.BaseMutationOptions<ResetFlightControllerDatabaseMutation, ResetFlightControllerDatabaseMutationVariables>;
export const ChildProcessCmdDocument = gql`
    mutation childProcessCmd($cmd: String!, $path: String!, $shell: Boolean) {
  childProcessCmd(cmd: $cmd, path: $path, shell: $shell) {
    message
    errors {
      path
      message
    }
  }
}
    `;
export type ChildProcessCmdMutationFn = Apollo.MutationFunction<ChildProcessCmdMutation, ChildProcessCmdMutationVariables>;

/**
 * __useChildProcessCmdMutation__
 *
 * To run a mutation, you first call `useChildProcessCmdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChildProcessCmdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [childProcessCmdMutation, { data, loading, error }] = useChildProcessCmdMutation({
 *   variables: {
 *      cmd: // value for 'cmd'
 *      path: // value for 'path'
 *      shell: // value for 'shell'
 *   },
 * });
 */
export function useChildProcessCmdMutation(baseOptions?: Apollo.MutationHookOptions<ChildProcessCmdMutation, ChildProcessCmdMutationVariables>) {
        return Apollo.useMutation<ChildProcessCmdMutation, ChildProcessCmdMutationVariables>(ChildProcessCmdDocument, baseOptions);
      }
export type ChildProcessCmdMutationHookResult = ReturnType<typeof useChildProcessCmdMutation>;
export type ChildProcessCmdMutationResult = Apollo.MutationResult<ChildProcessCmdMutation>;
export type ChildProcessCmdMutationOptions = Apollo.BaseMutationOptions<ChildProcessCmdMutation, ChildProcessCmdMutationVariables>;
export const RemoveLogfileDocument = gql`
    mutation removeLogfile($filename: String!) {
  removeLogfile(filename: $filename)
}
    `;
export type RemoveLogfileMutationFn = Apollo.MutationFunction<RemoveLogfileMutation, RemoveLogfileMutationVariables>;

/**
 * __useRemoveLogfileMutation__
 *
 * To run a mutation, you first call `useRemoveLogfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveLogfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeLogfileMutation, { data, loading, error }] = useRemoveLogfileMutation({
 *   variables: {
 *      filename: // value for 'filename'
 *   },
 * });
 */
export function useRemoveLogfileMutation(baseOptions?: Apollo.MutationHookOptions<RemoveLogfileMutation, RemoveLogfileMutationVariables>) {
        return Apollo.useMutation<RemoveLogfileMutation, RemoveLogfileMutationVariables>(RemoveLogfileDocument, baseOptions);
      }
export type RemoveLogfileMutationHookResult = ReturnType<typeof useRemoveLogfileMutation>;
export type RemoveLogfileMutationResult = Apollo.MutationResult<RemoveLogfileMutation>;
export type RemoveLogfileMutationOptions = Apollo.BaseMutationOptions<RemoveLogfileMutation, RemoveLogfileMutationVariables>;
export const RemoveAllLogfilesDocument = gql`
    mutation removeAllLogfiles {
  removeAllLogfiles
}
    `;
export type RemoveAllLogfilesMutationFn = Apollo.MutationFunction<RemoveAllLogfilesMutation, RemoveAllLogfilesMutationVariables>;

/**
 * __useRemoveAllLogfilesMutation__
 *
 * To run a mutation, you first call `useRemoveAllLogfilesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveAllLogfilesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeAllLogfilesMutation, { data, loading, error }] = useRemoveAllLogfilesMutation({
 *   variables: {
 *   },
 * });
 */
export function useRemoveAllLogfilesMutation(baseOptions?: Apollo.MutationHookOptions<RemoveAllLogfilesMutation, RemoveAllLogfilesMutationVariables>) {
        return Apollo.useMutation<RemoveAllLogfilesMutation, RemoveAllLogfilesMutationVariables>(RemoveAllLogfilesDocument, baseOptions);
      }
export type RemoveAllLogfilesMutationHookResult = ReturnType<typeof useRemoveAllLogfilesMutation>;
export type RemoveAllLogfilesMutationResult = Apollo.MutationResult<RemoveAllLogfilesMutation>;
export type RemoveAllLogfilesMutationOptions = Apollo.BaseMutationOptions<RemoveAllLogfilesMutation, RemoveAllLogfilesMutationVariables>;
export const PruneLogFilesDocument = gql`
    mutation pruneLogFiles($service: String!) {
  pruneLogFiles(service: $service)
}
    `;
export type PruneLogFilesMutationFn = Apollo.MutationFunction<PruneLogFilesMutation, PruneLogFilesMutationVariables>;

/**
 * __usePruneLogFilesMutation__
 *
 * To run a mutation, you first call `usePruneLogFilesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePruneLogFilesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pruneLogFilesMutation, { data, loading, error }] = usePruneLogFilesMutation({
 *   variables: {
 *      service: // value for 'service'
 *   },
 * });
 */
export function usePruneLogFilesMutation(baseOptions?: Apollo.MutationHookOptions<PruneLogFilesMutation, PruneLogFilesMutationVariables>) {
        return Apollo.useMutation<PruneLogFilesMutation, PruneLogFilesMutationVariables>(PruneLogFilesDocument, baseOptions);
      }
export type PruneLogFilesMutationHookResult = ReturnType<typeof usePruneLogFilesMutation>;
export type PruneLogFilesMutationResult = Apollo.MutationResult<PruneLogFilesMutation>;
export type PruneLogFilesMutationOptions = Apollo.BaseMutationOptions<PruneLogFilesMutation, PruneLogFilesMutationVariables>;
export const SetLoggerParametersDocument = gql`
    mutation setLoggerParameters($parameters: LogParameters!) {
  setLoggerParameters(parameters: $parameters) {
    logs {
      id
      debug
      cellSignal
      satellites
      altitude
      resolution
    }
  }
}
    `;
export type SetLoggerParametersMutationFn = Apollo.MutationFunction<SetLoggerParametersMutation, SetLoggerParametersMutationVariables>;

/**
 * __useSetLoggerParametersMutation__
 *
 * To run a mutation, you first call `useSetLoggerParametersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetLoggerParametersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setLoggerParametersMutation, { data, loading, error }] = useSetLoggerParametersMutation({
 *   variables: {
 *      parameters: // value for 'parameters'
 *   },
 * });
 */
export function useSetLoggerParametersMutation(baseOptions?: Apollo.MutationHookOptions<SetLoggerParametersMutation, SetLoggerParametersMutationVariables>) {
        return Apollo.useMutation<SetLoggerParametersMutation, SetLoggerParametersMutationVariables>(SetLoggerParametersDocument, baseOptions);
      }
export type SetLoggerParametersMutationHookResult = ReturnType<typeof useSetLoggerParametersMutation>;
export type SetLoggerParametersMutationResult = Apollo.MutationResult<SetLoggerParametersMutation>;
export type SetLoggerParametersMutationOptions = Apollo.BaseMutationOptions<SetLoggerParametersMutation, SetLoggerParametersMutationVariables>;
export const GetDockerLogDocument = gql`
    mutation getDockerLog($properties: LogProperties!) {
  getDockerLog(properties: $properties) {
    file {
      timestamp
      message
      data
      level
    }
  }
}
    `;
export type GetDockerLogMutationFn = Apollo.MutationFunction<GetDockerLogMutation, GetDockerLogMutationVariables>;

/**
 * __useGetDockerLogMutation__
 *
 * To run a mutation, you first call `useGetDockerLogMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGetDockerLogMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [getDockerLogMutation, { data, loading, error }] = useGetDockerLogMutation({
 *   variables: {
 *      properties: // value for 'properties'
 *   },
 * });
 */
export function useGetDockerLogMutation(baseOptions?: Apollo.MutationHookOptions<GetDockerLogMutation, GetDockerLogMutationVariables>) {
        return Apollo.useMutation<GetDockerLogMutation, GetDockerLogMutationVariables>(GetDockerLogDocument, baseOptions);
      }
export type GetDockerLogMutationHookResult = ReturnType<typeof useGetDockerLogMutation>;
export type GetDockerLogMutationResult = Apollo.MutationResult<GetDockerLogMutation>;
export type GetDockerLogMutationOptions = Apollo.BaseMutationOptions<GetDockerLogMutation, GetDockerLogMutationVariables>;
export const SendMavCommandDocument = gql`
    mutation sendMavCommand($type: String!, $value: String!) {
  sendMavCommand(type: $type, value: $value)
}
    `;
export type SendMavCommandMutationFn = Apollo.MutationFunction<SendMavCommandMutation, SendMavCommandMutationVariables>;

/**
 * __useSendMavCommandMutation__
 *
 * To run a mutation, you first call `useSendMavCommandMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMavCommandMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMavCommandMutation, { data, loading, error }] = useSendMavCommandMutation({
 *   variables: {
 *      type: // value for 'type'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useSendMavCommandMutation(baseOptions?: Apollo.MutationHookOptions<SendMavCommandMutation, SendMavCommandMutationVariables>) {
        return Apollo.useMutation<SendMavCommandMutation, SendMavCommandMutationVariables>(SendMavCommandDocument, baseOptions);
      }
export type SendMavCommandMutationHookResult = ReturnType<typeof useSendMavCommandMutation>;
export type SendMavCommandMutationResult = Apollo.MutationResult<SendMavCommandMutation>;
export type SendMavCommandMutationOptions = Apollo.BaseMutationOptions<SendMavCommandMutation, SendMavCommandMutationVariables>;
export const StoreModemValuesDocument = gql`
    mutation storeModemValues($properties: ModemProperties!) {
  storeModemValues(properties: $properties) {
    message {
      modemType
      modemInformation
    }
  }
}
    `;
export type StoreModemValuesMutationFn = Apollo.MutationFunction<StoreModemValuesMutation, StoreModemValuesMutationVariables>;

/**
 * __useStoreModemValuesMutation__
 *
 * To run a mutation, you first call `useStoreModemValuesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStoreModemValuesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [storeModemValuesMutation, { data, loading, error }] = useStoreModemValuesMutation({
 *   variables: {
 *      properties: // value for 'properties'
 *   },
 * });
 */
export function useStoreModemValuesMutation(baseOptions?: Apollo.MutationHookOptions<StoreModemValuesMutation, StoreModemValuesMutationVariables>) {
        return Apollo.useMutation<StoreModemValuesMutation, StoreModemValuesMutationVariables>(StoreModemValuesDocument, baseOptions);
      }
export type StoreModemValuesMutationHookResult = ReturnType<typeof useStoreModemValuesMutation>;
export type StoreModemValuesMutationResult = Apollo.MutationResult<StoreModemValuesMutation>;
export type StoreModemValuesMutationOptions = Apollo.BaseMutationOptions<StoreModemValuesMutation, StoreModemValuesMutationVariables>;
export const UpdateUavcastContainerDocument = gql`
    mutation updateUavcastContainer($version: String!) {
  updateUavcastContainer(version: $version) {
    message
    errors {
      message
      path
    }
  }
}
    `;
export type UpdateUavcastContainerMutationFn = Apollo.MutationFunction<UpdateUavcastContainerMutation, UpdateUavcastContainerMutationVariables>;

/**
 * __useUpdateUavcastContainerMutation__
 *
 * To run a mutation, you first call `useUpdateUavcastContainerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUavcastContainerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUavcastContainerMutation, { data, loading, error }] = useUpdateUavcastContainerMutation({
 *   variables: {
 *      version: // value for 'version'
 *   },
 * });
 */
export function useUpdateUavcastContainerMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUavcastContainerMutation, UpdateUavcastContainerMutationVariables>) {
        return Apollo.useMutation<UpdateUavcastContainerMutation, UpdateUavcastContainerMutationVariables>(UpdateUavcastContainerDocument, baseOptions);
      }
export type UpdateUavcastContainerMutationHookResult = ReturnType<typeof useUpdateUavcastContainerMutation>;
export type UpdateUavcastContainerMutationResult = Apollo.MutationResult<UpdateUavcastContainerMutation>;
export type UpdateUavcastContainerMutationOptions = Apollo.BaseMutationOptions<UpdateUavcastContainerMutation, UpdateUavcastContainerMutationVariables>;
export const UpdateSupervisorContainerDocument = gql`
    mutation updateSupervisorContainer($version: String!) {
  updateSupervisorContainer(version: $version) {
    message
    errors {
      message
      path
    }
  }
}
    `;
export type UpdateSupervisorContainerMutationFn = Apollo.MutationFunction<UpdateSupervisorContainerMutation, UpdateSupervisorContainerMutationVariables>;

/**
 * __useUpdateSupervisorContainerMutation__
 *
 * To run a mutation, you first call `useUpdateSupervisorContainerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSupervisorContainerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSupervisorContainerMutation, { data, loading, error }] = useUpdateSupervisorContainerMutation({
 *   variables: {
 *      version: // value for 'version'
 *   },
 * });
 */
export function useUpdateSupervisorContainerMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSupervisorContainerMutation, UpdateSupervisorContainerMutationVariables>) {
        return Apollo.useMutation<UpdateSupervisorContainerMutation, UpdateSupervisorContainerMutationVariables>(UpdateSupervisorContainerDocument, baseOptions);
      }
export type UpdateSupervisorContainerMutationHookResult = ReturnType<typeof useUpdateSupervisorContainerMutation>;
export type UpdateSupervisorContainerMutationResult = Apollo.MutationResult<UpdateSupervisorContainerMutation>;
export type UpdateSupervisorContainerMutationOptions = Apollo.BaseMutationOptions<UpdateSupervisorContainerMutation, UpdateSupervisorContainerMutationVariables>;
export const SupervisorCommandsDocument = gql`
    mutation supervisorCommands($type: String!, $command: String) {
  supervisorCommands(type: $type, command: $command)
}
    `;
export type SupervisorCommandsMutationFn = Apollo.MutationFunction<SupervisorCommandsMutation, SupervisorCommandsMutationVariables>;

/**
 * __useSupervisorCommandsMutation__
 *
 * To run a mutation, you first call `useSupervisorCommandsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSupervisorCommandsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [supervisorCommandsMutation, { data, loading, error }] = useSupervisorCommandsMutation({
 *   variables: {
 *      type: // value for 'type'
 *      command: // value for 'command'
 *   },
 * });
 */
export function useSupervisorCommandsMutation(baseOptions?: Apollo.MutationHookOptions<SupervisorCommandsMutation, SupervisorCommandsMutationVariables>) {
        return Apollo.useMutation<SupervisorCommandsMutation, SupervisorCommandsMutationVariables>(SupervisorCommandsDocument, baseOptions);
      }
export type SupervisorCommandsMutationHookResult = ReturnType<typeof useSupervisorCommandsMutation>;
export type SupervisorCommandsMutationResult = Apollo.MutationResult<SupervisorCommandsMutation>;
export type SupervisorCommandsMutationOptions = Apollo.BaseMutationOptions<SupervisorCommandsMutation, SupervisorCommandsMutationVariables>;
export const StoreVpnValuesDocument = gql`
    mutation storeVpnValues($properties: VpnProperties!) {
  storeVpnValues(properties: $properties) {
    data {
      id
      enableVpn
      serviceProvider
      networkId
      username
      password
    }
  }
}
    `;
export type StoreVpnValuesMutationFn = Apollo.MutationFunction<StoreVpnValuesMutation, StoreVpnValuesMutationVariables>;

/**
 * __useStoreVpnValuesMutation__
 *
 * To run a mutation, you first call `useStoreVpnValuesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStoreVpnValuesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [storeVpnValuesMutation, { data, loading, error }] = useStoreVpnValuesMutation({
 *   variables: {
 *      properties: // value for 'properties'
 *   },
 * });
 */
export function useStoreVpnValuesMutation(baseOptions?: Apollo.MutationHookOptions<StoreVpnValuesMutation, StoreVpnValuesMutationVariables>) {
        return Apollo.useMutation<StoreVpnValuesMutation, StoreVpnValuesMutationVariables>(StoreVpnValuesDocument, baseOptions);
      }
export type StoreVpnValuesMutationHookResult = ReturnType<typeof useStoreVpnValuesMutation>;
export type StoreVpnValuesMutationResult = Apollo.MutationResult<StoreVpnValuesMutation>;
export type StoreVpnValuesMutationOptions = Apollo.BaseMutationOptions<StoreVpnValuesMutation, StoreVpnValuesMutationVariables>;
export const UploadConfigFileDocument = gql`
    mutation uploadConfigFile($file: Upload!) {
  uploadConfigFile(file: $file)
}
    `;
export type UploadConfigFileMutationFn = Apollo.MutationFunction<UploadConfigFileMutation, UploadConfigFileMutationVariables>;

/**
 * __useUploadConfigFileMutation__
 *
 * To run a mutation, you first call `useUploadConfigFileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadConfigFileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadConfigFileMutation, { data, loading, error }] = useUploadConfigFileMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadConfigFileMutation(baseOptions?: Apollo.MutationHookOptions<UploadConfigFileMutation, UploadConfigFileMutationVariables>) {
        return Apollo.useMutation<UploadConfigFileMutation, UploadConfigFileMutationVariables>(UploadConfigFileDocument, baseOptions);
      }
export type UploadConfigFileMutationHookResult = ReturnType<typeof useUploadConfigFileMutation>;
export type UploadConfigFileMutationResult = Apollo.MutationResult<UploadConfigFileMutation>;
export type UploadConfigFileMutationOptions = Apollo.BaseMutationOptions<UploadConfigFileMutation, UploadConfigFileMutationVariables>;
export const GetApplicationDocument = gql`
    query getApplication {
  getApplication {
    properties {
      webPort
    }
  }
}
    `;

/**
 * __useGetApplicationQuery__
 *
 * To run a query within a React component, call `useGetApplicationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApplicationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApplicationQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetApplicationQuery(baseOptions?: Apollo.QueryHookOptions<GetApplicationQuery, GetApplicationQueryVariables>) {
        return Apollo.useQuery<GetApplicationQuery, GetApplicationQueryVariables>(GetApplicationDocument, baseOptions);
      }
export function useGetApplicationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetApplicationQuery, GetApplicationQueryVariables>) {
          return Apollo.useLazyQuery<GetApplicationQuery, GetApplicationQueryVariables>(GetApplicationDocument, baseOptions);
        }
export type GetApplicationQueryHookResult = ReturnType<typeof useGetApplicationQuery>;
export type GetApplicationLazyQueryHookResult = ReturnType<typeof useGetApplicationLazyQuery>;
export type GetApplicationQueryResult = Apollo.QueryResult<GetApplicationQuery, GetApplicationQueryVariables>;
export const CameraDataDocument = gql`
    query cameraData {
  cameraData {
    database {
      id
      key
      name
      path
      protocol
      resolution
      enableCamera
      customPipeline
      framesPrSecond
      bitratePrSecond
      contrast
      rotation
      brightness
      whiteBalance
      flipCamera
    }
    availableCams {
      key
      value
      text
      caps {
        value
        text
        height
        width
        format
      }
    }
  }
}
    `;

/**
 * __useCameraDataQuery__
 *
 * To run a query within a React component, call `useCameraDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useCameraDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCameraDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useCameraDataQuery(baseOptions?: Apollo.QueryHookOptions<CameraDataQuery, CameraDataQueryVariables>) {
        return Apollo.useQuery<CameraDataQuery, CameraDataQueryVariables>(CameraDataDocument, baseOptions);
      }
export function useCameraDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CameraDataQuery, CameraDataQueryVariables>) {
          return Apollo.useLazyQuery<CameraDataQuery, CameraDataQueryVariables>(CameraDataDocument, baseOptions);
        }
export type CameraDataQueryHookResult = ReturnType<typeof useCameraDataQuery>;
export type CameraDataLazyQueryHookResult = ReturnType<typeof useCameraDataLazyQuery>;
export type CameraDataQueryResult = Apollo.QueryResult<CameraDataQuery, CameraDataQueryVariables>;
export const GetEndpointsDocument = gql`
    query getEndpoints {
  getEndpoints {
    data {
      id
      telemEnable
      moduleActive
      name
      endpointIPaddress
      telemetryPort
      videoPort
      videoEnable
    }
  }
}
    `;

/**
 * __useGetEndpointsQuery__
 *
 * To run a query within a React component, call `useGetEndpointsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEndpointsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEndpointsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetEndpointsQuery(baseOptions?: Apollo.QueryHookOptions<GetEndpointsQuery, GetEndpointsQueryVariables>) {
        return Apollo.useQuery<GetEndpointsQuery, GetEndpointsQueryVariables>(GetEndpointsDocument, baseOptions);
      }
export function useGetEndpointsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetEndpointsQuery, GetEndpointsQueryVariables>) {
          return Apollo.useLazyQuery<GetEndpointsQuery, GetEndpointsQueryVariables>(GetEndpointsDocument, baseOptions);
        }
export type GetEndpointsQueryHookResult = ReturnType<typeof useGetEndpointsQuery>;
export type GetEndpointsLazyQueryHookResult = ReturnType<typeof useGetEndpointsLazyQuery>;
export type GetEndpointsQueryResult = Apollo.QueryResult<GetEndpointsQuery, GetEndpointsQueryVariables>;
export const FlightControllerDocument = gql`
    query flightController {
  flightController {
    data {
      id
      controller
      protocol
      connectionType
      internalAddress
      baudRate
      tcpPort
      binFlightLog
    }
  }
}
    `;

/**
 * __useFlightControllerQuery__
 *
 * To run a query within a React component, call `useFlightControllerQuery` and pass it any options that fit your needs.
 * When your component renders, `useFlightControllerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFlightControllerQuery({
 *   variables: {
 *   },
 * });
 */
export function useFlightControllerQuery(baseOptions?: Apollo.QueryHookOptions<FlightControllerQuery, FlightControllerQueryVariables>) {
        return Apollo.useQuery<FlightControllerQuery, FlightControllerQueryVariables>(FlightControllerDocument, baseOptions);
      }
export function useFlightControllerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FlightControllerQuery, FlightControllerQueryVariables>) {
          return Apollo.useLazyQuery<FlightControllerQuery, FlightControllerQueryVariables>(FlightControllerDocument, baseOptions);
        }
export type FlightControllerQueryHookResult = ReturnType<typeof useFlightControllerQuery>;
export type FlightControllerLazyQueryHookResult = ReturnType<typeof useFlightControllerLazyQuery>;
export type FlightControllerQueryResult = Apollo.QueryResult<FlightControllerQuery, FlightControllerQueryVariables>;
export const GetFileNamesDocument = gql`
    query getFileNames {
  getFileNames {
    files
  }
}
    `;

/**
 * __useGetFileNamesQuery__
 *
 * To run a query within a React component, call `useGetFileNamesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFileNamesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFileNamesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetFileNamesQuery(baseOptions?: Apollo.QueryHookOptions<GetFileNamesQuery, GetFileNamesQueryVariables>) {
        return Apollo.useQuery<GetFileNamesQuery, GetFileNamesQueryVariables>(GetFileNamesDocument, baseOptions);
      }
export function useGetFileNamesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFileNamesQuery, GetFileNamesQueryVariables>) {
          return Apollo.useLazyQuery<GetFileNamesQuery, GetFileNamesQueryVariables>(GetFileNamesDocument, baseOptions);
        }
export type GetFileNamesQueryHookResult = ReturnType<typeof useGetFileNamesQuery>;
export type GetFileNamesLazyQueryHookResult = ReturnType<typeof useGetFileNamesLazyQuery>;
export type GetFileNamesQueryResult = Apollo.QueryResult<GetFileNamesQuery, GetFileNamesQueryVariables>;
export const GetFileDataDocument = gql`
    query getFileData($filename: String!) {
  getFileData(filename: $filename) {
    data
  }
}
    `;

/**
 * __useGetFileDataQuery__
 *
 * To run a query within a React component, call `useGetFileDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFileDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFileDataQuery({
 *   variables: {
 *      filename: // value for 'filename'
 *   },
 * });
 */
export function useGetFileDataQuery(baseOptions: Apollo.QueryHookOptions<GetFileDataQuery, GetFileDataQueryVariables>) {
        return Apollo.useQuery<GetFileDataQuery, GetFileDataQueryVariables>(GetFileDataDocument, baseOptions);
      }
export function useGetFileDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFileDataQuery, GetFileDataQueryVariables>) {
          return Apollo.useLazyQuery<GetFileDataQuery, GetFileDataQueryVariables>(GetFileDataDocument, baseOptions);
        }
export type GetFileDataQueryHookResult = ReturnType<typeof useGetFileDataQuery>;
export type GetFileDataLazyQueryHookResult = ReturnType<typeof useGetFileDataLazyQuery>;
export type GetFileDataQueryResult = Apollo.QueryResult<GetFileDataQuery, GetFileDataQueryVariables>;
export const GetTempLogDocument = gql`
    query getTempLog($properties: LogProperties!) {
  getTempLog(properties: $properties) {
    file {
      message
      timestamp
    }
  }
}
    `;

/**
 * __useGetTempLogQuery__
 *
 * To run a query within a React component, call `useGetTempLogQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTempLogQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTempLogQuery({
 *   variables: {
 *      properties: // value for 'properties'
 *   },
 * });
 */
export function useGetTempLogQuery(baseOptions: Apollo.QueryHookOptions<GetTempLogQuery, GetTempLogQueryVariables>) {
        return Apollo.useQuery<GetTempLogQuery, GetTempLogQueryVariables>(GetTempLogDocument, baseOptions);
      }
export function useGetTempLogLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTempLogQuery, GetTempLogQueryVariables>) {
          return Apollo.useLazyQuery<GetTempLogQuery, GetTempLogQueryVariables>(GetTempLogDocument, baseOptions);
        }
export type GetTempLogQueryHookResult = ReturnType<typeof useGetTempLogQuery>;
export type GetTempLogLazyQueryHookResult = ReturnType<typeof useGetTempLogLazyQuery>;
export type GetTempLogQueryResult = Apollo.QueryResult<GetTempLogQuery, GetTempLogQueryVariables>;
export const GetNetworkLogDocument = gql`
    query getNetworkLog($properties: LogProperties!) {
  getNetworkLog(properties: $properties) {
    file {
      message {
        iface
        rx_bytes
        tx_bytes
        rx_sec
        tx_sec
      }
      timestamp
    }
  }
}
    `;

/**
 * __useGetNetworkLogQuery__
 *
 * To run a query within a React component, call `useGetNetworkLogQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNetworkLogQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNetworkLogQuery({
 *   variables: {
 *      properties: // value for 'properties'
 *   },
 * });
 */
export function useGetNetworkLogQuery(baseOptions: Apollo.QueryHookOptions<GetNetworkLogQuery, GetNetworkLogQueryVariables>) {
        return Apollo.useQuery<GetNetworkLogQuery, GetNetworkLogQueryVariables>(GetNetworkLogDocument, baseOptions);
      }
export function useGetNetworkLogLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNetworkLogQuery, GetNetworkLogQueryVariables>) {
          return Apollo.useLazyQuery<GetNetworkLogQuery, GetNetworkLogQueryVariables>(GetNetworkLogDocument, baseOptions);
        }
export type GetNetworkLogQueryHookResult = ReturnType<typeof useGetNetworkLogQuery>;
export type GetNetworkLogLazyQueryHookResult = ReturnType<typeof useGetNetworkLogLazyQuery>;
export type GetNetworkLogQueryResult = Apollo.QueryResult<GetNetworkLogQuery, GetNetworkLogQueryVariables>;
export const GetServerLogDocument = gql`
    query getServerLog($properties: LogProperties!) {
  getServerLog(properties: $properties) {
    file {
      timestamp
      message
      data
      level
    }
  }
}
    `;

/**
 * __useGetServerLogQuery__
 *
 * To run a query within a React component, call `useGetServerLogQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetServerLogQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetServerLogQuery({
 *   variables: {
 *      properties: // value for 'properties'
 *   },
 * });
 */
export function useGetServerLogQuery(baseOptions: Apollo.QueryHookOptions<GetServerLogQuery, GetServerLogQueryVariables>) {
        return Apollo.useQuery<GetServerLogQuery, GetServerLogQueryVariables>(GetServerLogDocument, baseOptions);
      }
export function useGetServerLogLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetServerLogQuery, GetServerLogQueryVariables>) {
          return Apollo.useLazyQuery<GetServerLogQuery, GetServerLogQueryVariables>(GetServerLogDocument, baseOptions);
        }
export type GetServerLogQueryHookResult = ReturnType<typeof useGetServerLogQuery>;
export type GetServerLogLazyQueryHookResult = ReturnType<typeof useGetServerLogLazyQuery>;
export type GetServerLogQueryResult = Apollo.QueryResult<GetServerLogQuery, GetServerLogQueryVariables>;
export const GetCpuLogDocument = gql`
    query getCpuLog($properties: LogProperties!) {
  getCpuLog(properties: $properties) {
    file {
      timestamp
      message
    }
  }
}
    `;

/**
 * __useGetCpuLogQuery__
 *
 * To run a query within a React component, call `useGetCpuLogQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCpuLogQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCpuLogQuery({
 *   variables: {
 *      properties: // value for 'properties'
 *   },
 * });
 */
export function useGetCpuLogQuery(baseOptions: Apollo.QueryHookOptions<GetCpuLogQuery, GetCpuLogQueryVariables>) {
        return Apollo.useQuery<GetCpuLogQuery, GetCpuLogQueryVariables>(GetCpuLogDocument, baseOptions);
      }
export function useGetCpuLogLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCpuLogQuery, GetCpuLogQueryVariables>) {
          return Apollo.useLazyQuery<GetCpuLogQuery, GetCpuLogQueryVariables>(GetCpuLogDocument, baseOptions);
        }
export type GetCpuLogQueryHookResult = ReturnType<typeof useGetCpuLogQuery>;
export type GetCpuLogLazyQueryHookResult = ReturnType<typeof useGetCpuLogLazyQuery>;
export type GetCpuLogQueryResult = Apollo.QueryResult<GetCpuLogQuery, GetCpuLogQueryVariables>;
export const GetLoggerParametersDocument = gql`
    query getLoggerParameters {
  getLoggerParameters {
    logs {
      id
      debug
      cellSignal
      satellites
      altitude
      resolution
    }
  }
}
    `;

/**
 * __useGetLoggerParametersQuery__
 *
 * To run a query within a React component, call `useGetLoggerParametersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLoggerParametersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLoggerParametersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLoggerParametersQuery(baseOptions?: Apollo.QueryHookOptions<GetLoggerParametersQuery, GetLoggerParametersQueryVariables>) {
        return Apollo.useQuery<GetLoggerParametersQuery, GetLoggerParametersQueryVariables>(GetLoggerParametersDocument, baseOptions);
      }
export function useGetLoggerParametersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLoggerParametersQuery, GetLoggerParametersQueryVariables>) {
          return Apollo.useLazyQuery<GetLoggerParametersQuery, GetLoggerParametersQueryVariables>(GetLoggerParametersDocument, baseOptions);
        }
export type GetLoggerParametersQueryHookResult = ReturnType<typeof useGetLoggerParametersQuery>;
export type GetLoggerParametersLazyQueryHookResult = ReturnType<typeof useGetLoggerParametersLazyQuery>;
export type GetLoggerParametersQueryResult = Apollo.QueryResult<GetLoggerParametersQuery, GetLoggerParametersQueryVariables>;
export const MapDocument = gql`
    query map {
  map {
    mavCockpitDisable
  }
}
    `;

/**
 * __useMapQuery__
 *
 * To run a query within a React component, call `useMapQuery` and pass it any options that fit your needs.
 * When your component renders, `useMapQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMapQuery({
 *   variables: {
 *   },
 * });
 */
export function useMapQuery(baseOptions?: Apollo.QueryHookOptions<MapQuery, MapQueryVariables>) {
        return Apollo.useQuery<MapQuery, MapQueryVariables>(MapDocument, baseOptions);
      }
export function useMapLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MapQuery, MapQueryVariables>) {
          return Apollo.useLazyQuery<MapQuery, MapQueryVariables>(MapDocument, baseOptions);
        }
export type MapQueryHookResult = ReturnType<typeof useMapQuery>;
export type MapLazyQueryHookResult = ReturnType<typeof useMapLazyQuery>;
export type MapQueryResult = Apollo.QueryResult<MapQuery, MapQueryVariables>;
export const ModemDataDocument = gql`
    query modemData {
  modemData {
    message {
      modemType
      modemInformation
      modemInterface
      enableModem
      internalAddress
      pinCode
      username
      password
    }
  }
}
    `;

/**
 * __useModemDataQuery__
 *
 * To run a query within a React component, call `useModemDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useModemDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useModemDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useModemDataQuery(baseOptions?: Apollo.QueryHookOptions<ModemDataQuery, ModemDataQueryVariables>) {
        return Apollo.useQuery<ModemDataQuery, ModemDataQueryVariables>(ModemDataDocument, baseOptions);
      }
export function useModemDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ModemDataQuery, ModemDataQueryVariables>) {
          return Apollo.useLazyQuery<ModemDataQuery, ModemDataQueryVariables>(ModemDataDocument, baseOptions);
        }
export type ModemDataQueryHookResult = ReturnType<typeof useModemDataQuery>;
export type ModemDataLazyQueryHookResult = ReturnType<typeof useModemDataLazyQuery>;
export type ModemDataQueryResult = Apollo.QueryResult<ModemDataQuery, ModemDataQueryVariables>;
export const NicDocument = gql`
    query nic {
  nic {
    interfaces
  }
}
    `;

/**
 * __useNicQuery__
 *
 * To run a query within a React component, call `useNicQuery` and pass it any options that fit your needs.
 * When your component renders, `useNicQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNicQuery({
 *   variables: {
 *   },
 * });
 */
export function useNicQuery(baseOptions?: Apollo.QueryHookOptions<NicQuery, NicQueryVariables>) {
        return Apollo.useQuery<NicQuery, NicQueryVariables>(NicDocument, baseOptions);
      }
export function useNicLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NicQuery, NicQueryVariables>) {
          return Apollo.useLazyQuery<NicQuery, NicQueryVariables>(NicDocument, baseOptions);
        }
export type NicQueryHookResult = ReturnType<typeof useNicQuery>;
export type NicLazyQueryHookResult = ReturnType<typeof useNicLazyQuery>;
export type NicQueryResult = Apollo.QueryResult<NicQuery, NicQueryVariables>;
export const GetAvailableVersionsDocument = gql`
    query getAvailableVersions($application: String!) {
  getAvailableVersions(application: $application) {
    count
    results {
      id
      name
      tag_status
      last_updated
      full_size
    }
    error
  }
}
    `;

/**
 * __useGetAvailableVersionsQuery__
 *
 * To run a query within a React component, call `useGetAvailableVersionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAvailableVersionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAvailableVersionsQuery({
 *   variables: {
 *      application: // value for 'application'
 *   },
 * });
 */
export function useGetAvailableVersionsQuery(baseOptions: Apollo.QueryHookOptions<GetAvailableVersionsQuery, GetAvailableVersionsQueryVariables>) {
        return Apollo.useQuery<GetAvailableVersionsQuery, GetAvailableVersionsQueryVariables>(GetAvailableVersionsDocument, baseOptions);
      }
export function useGetAvailableVersionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAvailableVersionsQuery, GetAvailableVersionsQueryVariables>) {
          return Apollo.useLazyQuery<GetAvailableVersionsQuery, GetAvailableVersionsQueryVariables>(GetAvailableVersionsDocument, baseOptions);
        }
export type GetAvailableVersionsQueryHookResult = ReturnType<typeof useGetAvailableVersionsQuery>;
export type GetAvailableVersionsLazyQueryHookResult = ReturnType<typeof useGetAvailableVersionsLazyQuery>;
export type GetAvailableVersionsQueryResult = Apollo.QueryResult<GetAvailableVersionsQuery, GetAvailableVersionsQueryVariables>;
export const GetUavcastInformationDocument = gql`
    query getUavcastInformation {
  getUavcastInformation {
    message {
      supervisor {
        repo
        isRunning
        remoteVersion
        localVersion
        hasLatest
        newVersionExsist
      }
      uavcast {
        repo
        isRunning
        remoteVersion
        localVersion
        hasLatest
        newVersionExsist
      }
    }
    errors {
      path
      message
    }
  }
}
    `;

/**
 * __useGetUavcastInformationQuery__
 *
 * To run a query within a React component, call `useGetUavcastInformationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUavcastInformationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUavcastInformationQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUavcastInformationQuery(baseOptions?: Apollo.QueryHookOptions<GetUavcastInformationQuery, GetUavcastInformationQueryVariables>) {
        return Apollo.useQuery<GetUavcastInformationQuery, GetUavcastInformationQueryVariables>(GetUavcastInformationDocument, baseOptions);
      }
export function useGetUavcastInformationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUavcastInformationQuery, GetUavcastInformationQueryVariables>) {
          return Apollo.useLazyQuery<GetUavcastInformationQuery, GetUavcastInformationQueryVariables>(GetUavcastInformationDocument, baseOptions);
        }
export type GetUavcastInformationQueryHookResult = ReturnType<typeof useGetUavcastInformationQuery>;
export type GetUavcastInformationLazyQueryHookResult = ReturnType<typeof useGetUavcastInformationLazyQuery>;
export type GetUavcastInformationQueryResult = Apollo.QueryResult<GetUavcastInformationQuery, GetUavcastInformationQueryVariables>;
export const GetSupervisorInformationDocument = gql`
    query getSupervisorInformation {
  getSupervisorInformation {
    message {
      supervisor {
        repo
        isRunning
        remoteVersion
        localVersion
        hasLatest
        newVersionExsist
      }
      uavcast {
        repo
        isRunning
        remoteVersion
        localVersion
        hasLatest
        newVersionExsist
      }
    }
    errors {
      path
      message
    }
  }
}
    `;

/**
 * __useGetSupervisorInformationQuery__
 *
 * To run a query within a React component, call `useGetSupervisorInformationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSupervisorInformationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSupervisorInformationQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSupervisorInformationQuery(baseOptions?: Apollo.QueryHookOptions<GetSupervisorInformationQuery, GetSupervisorInformationQueryVariables>) {
        return Apollo.useQuery<GetSupervisorInformationQuery, GetSupervisorInformationQueryVariables>(GetSupervisorInformationDocument, baseOptions);
      }
export function useGetSupervisorInformationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSupervisorInformationQuery, GetSupervisorInformationQueryVariables>) {
          return Apollo.useLazyQuery<GetSupervisorInformationQuery, GetSupervisorInformationQueryVariables>(GetSupervisorInformationDocument, baseOptions);
        }
export type GetSupervisorInformationQueryHookResult = ReturnType<typeof useGetSupervisorInformationQuery>;
export type GetSupervisorInformationLazyQueryHookResult = ReturnType<typeof useGetSupervisorInformationLazyQuery>;
export type GetSupervisorInformationQueryResult = Apollo.QueryResult<GetSupervisorInformationQuery, GetSupervisorInformationQueryVariables>;
export const VpnDataDocument = gql`
    query vpnData {
  vpnData {
    data {
      id
      enableVpn
      serviceProvider
      networkId
      username
      password
    }
  }
}
    `;

/**
 * __useVpnDataQuery__
 *
 * To run a query within a React component, call `useVpnDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useVpnDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVpnDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useVpnDataQuery(baseOptions?: Apollo.QueryHookOptions<VpnDataQuery, VpnDataQueryVariables>) {
        return Apollo.useQuery<VpnDataQuery, VpnDataQueryVariables>(VpnDataDocument, baseOptions);
      }
export function useVpnDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VpnDataQuery, VpnDataQueryVariables>) {
          return Apollo.useLazyQuery<VpnDataQuery, VpnDataQueryVariables>(VpnDataDocument, baseOptions);
        }
export type VpnDataQueryHookResult = ReturnType<typeof useVpnDataQuery>;
export type VpnDataLazyQueryHookResult = ReturnType<typeof useVpnDataLazyQuery>;
export type VpnDataQueryResult = Apollo.QueryResult<VpnDataQuery, VpnDataQueryVariables>;
export const ZerotierNetworksDocument = gql`
    query zerotierNetworks {
  zerotierNetworks {
    networks {
      assignedAddresses
      name
      nwid
      portDeviceName
      status
      type
    }
  }
}
    `;

/**
 * __useZerotierNetworksQuery__
 *
 * To run a query within a React component, call `useZerotierNetworksQuery` and pass it any options that fit your needs.
 * When your component renders, `useZerotierNetworksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useZerotierNetworksQuery({
 *   variables: {
 *   },
 * });
 */
export function useZerotierNetworksQuery(baseOptions?: Apollo.QueryHookOptions<ZerotierNetworksQuery, ZerotierNetworksQueryVariables>) {
        return Apollo.useQuery<ZerotierNetworksQuery, ZerotierNetworksQueryVariables>(ZerotierNetworksDocument, baseOptions);
      }
export function useZerotierNetworksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ZerotierNetworksQuery, ZerotierNetworksQueryVariables>) {
          return Apollo.useLazyQuery<ZerotierNetworksQuery, ZerotierNetworksQueryVariables>(ZerotierNetworksDocument, baseOptions);
        }
export type ZerotierNetworksQueryHookResult = ReturnType<typeof useZerotierNetworksQuery>;
export type ZerotierNetworksLazyQueryHookResult = ReturnType<typeof useZerotierNetworksLazyQuery>;
export type ZerotierNetworksQueryResult = Apollo.QueryResult<ZerotierNetworksQuery, ZerotierNetworksQueryVariables>;
export const Camera_StdoutDocument = gql`
    subscription camera_stdout {
  camera_stdout {
    message
    errors {
      path
      message
    }
  }
}
    `;

/**
 * __useCamera_StdoutSubscription__
 *
 * To run a query within a React component, call `useCamera_StdoutSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCamera_StdoutSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCamera_StdoutSubscription({
 *   variables: {
 *   },
 * });
 */
export function useCamera_StdoutSubscription(baseOptions?: Apollo.SubscriptionHookOptions<Camera_StdoutSubscription, Camera_StdoutSubscriptionVariables>) {
        return Apollo.useSubscription<Camera_StdoutSubscription, Camera_StdoutSubscriptionVariables>(Camera_StdoutDocument, baseOptions);
      }
export type Camera_StdoutSubscriptionHookResult = ReturnType<typeof useCamera_StdoutSubscription>;
export type Camera_StdoutSubscriptionResult = Apollo.SubscriptionResult<Camera_StdoutSubscription>;
export const StatusDocument = gql`
    subscription status {
  status {
    mavproxy
    has_camera
    video
    modem
    uavcast_systemd_active
    uavcast_systemd_enabled
    vpn
    undervoltage
    arch
  }
}
    `;

/**
 * __useStatusSubscription__
 *
 * To run a query within a React component, call `useStatusSubscription` and pass it any options that fit your needs.
 * When your component renders, `useStatusSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStatusSubscription({
 *   variables: {
 *   },
 * });
 */
export function useStatusSubscription(baseOptions?: Apollo.SubscriptionHookOptions<StatusSubscription, StatusSubscriptionVariables>) {
        return Apollo.useSubscription<StatusSubscription, StatusSubscriptionVariables>(StatusDocument, baseOptions);
      }
export type StatusSubscriptionHookResult = ReturnType<typeof useStatusSubscription>;
export type StatusSubscriptionResult = Apollo.SubscriptionResult<StatusSubscription>;
export const MavlinkDocument = gql`
    subscription mavlink {
  mavlink {
    message {
      heartbeat {
        armed
        connected
        type
        autopilot
        base_mode
        custom_mode
        system_status
        mavlink_version
        firmware
        frame
        numOfGcs {
          type
        }
      }
      vfr_hud {
        airspeed
        groundspeed
        heading
        throttle
        alt
        climb
      }
      power_status {
        Vcc
        Vservo
        flags
      }
      failsafe {
        gcs {
          param_value
        }
        short {
          param_value
        }
        long {
          param_value
        }
      }
      gps_raw_int {
        fix_type
        lat
        lon
        alt
        vel
        cog
        satellites_visible
      }
    }
  }
}
    `;

/**
 * __useMavlinkSubscription__
 *
 * To run a query within a React component, call `useMavlinkSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMavlinkSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMavlinkSubscription({
 *   variables: {
 *   },
 * });
 */
export function useMavlinkSubscription(baseOptions?: Apollo.SubscriptionHookOptions<MavlinkSubscription, MavlinkSubscriptionVariables>) {
        return Apollo.useSubscription<MavlinkSubscription, MavlinkSubscriptionVariables>(MavlinkDocument, baseOptions);
      }
export type MavlinkSubscriptionHookResult = ReturnType<typeof useMavlinkSubscription>;
export type MavlinkSubscriptionResult = Apollo.SubscriptionResult<MavlinkSubscription>;
export const CmdAckDocument = gql`
    subscription cmdAck {
  cmdAck {
    command
    result
    message
    errors {
      path
      message
    }
  }
}
    `;

/**
 * __useCmdAckSubscription__
 *
 * To run a query within a React component, call `useCmdAckSubscription` and pass it any options that fit your needs.
 * When your component renders, `useCmdAckSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCmdAckSubscription({
 *   variables: {
 *   },
 * });
 */
export function useCmdAckSubscription(baseOptions?: Apollo.SubscriptionHookOptions<CmdAckSubscription, CmdAckSubscriptionVariables>) {
        return Apollo.useSubscription<CmdAckSubscription, CmdAckSubscriptionVariables>(CmdAckDocument, baseOptions);
      }
export type CmdAckSubscriptionHookResult = ReturnType<typeof useCmdAckSubscription>;
export type CmdAckSubscriptionResult = Apollo.SubscriptionResult<CmdAckSubscription>;
export const StdoutDocument = gql`
    subscription stdout {
  stdout {
    message
    errors {
      path
      message
    }
  }
}
    `;

/**
 * __useStdoutSubscription__
 *
 * To run a query within a React component, call `useStdoutSubscription` and pass it any options that fit your needs.
 * When your component renders, `useStdoutSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStdoutSubscription({
 *   variables: {
 *   },
 * });
 */
export function useStdoutSubscription(baseOptions?: Apollo.SubscriptionHookOptions<StdoutSubscription, StdoutSubscriptionVariables>) {
        return Apollo.useSubscription<StdoutSubscription, StdoutSubscriptionVariables>(StdoutDocument, baseOptions);
      }
export type StdoutSubscriptionHookResult = ReturnType<typeof useStdoutSubscription>;
export type StdoutSubscriptionResult = Apollo.SubscriptionResult<StdoutSubscription>;
export const SupervisorDocument = gql`
    subscription supervisor {
  supervisor {
    message
    errors {
      path
      message
    }
  }
}
    `;

/**
 * __useSupervisorSubscription__
 *
 * To run a query within a React component, call `useSupervisorSubscription` and pass it any options that fit your needs.
 * When your component renders, `useSupervisorSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSupervisorSubscription({
 *   variables: {
 *   },
 * });
 */
export function useSupervisorSubscription(baseOptions?: Apollo.SubscriptionHookOptions<SupervisorSubscription, SupervisorSubscriptionVariables>) {
        return Apollo.useSubscription<SupervisorSubscription, SupervisorSubscriptionVariables>(SupervisorDocument, baseOptions);
      }
export type SupervisorSubscriptionHookResult = ReturnType<typeof useSupervisorSubscription>;
export type SupervisorSubscriptionResult = Apollo.SubscriptionResult<SupervisorSubscription>;