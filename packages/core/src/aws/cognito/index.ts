import {
  AdminGetUserCommand,
  AdminInitiateAuthCommand,
  SignUpCommand,
  AuthFlowType,
  CognitoIdentityProviderClient,
  AdminUserGlobalSignOutCommand,
} from '@aws-sdk/client-cognito-identity-provider';

export type AdminInitiateAuthRequest = {
  region: string;
  clientId: string;
  userPoolId: string;
  username: string;
  password: string;
};

export type AdminGetUserRequest = {
  region: string;
  userPoolId: string;
  username: string;
};

export type AdminRegisterUserRequest = {
  region: string;
  clientId: string;
  username: string;
  password: string;
  email: string;
};

const createClientForDefaultRegion = (region = 'us-east-1') => new CognitoIdentityProviderClient({ region });

export const adminInitiateAuth = async ({
  region,
  clientId,
  userPoolId,
  username,
  password,
}: AdminInitiateAuthRequest) => {
  const client = createClientForDefaultRegion(region);

  const command = new AdminInitiateAuthCommand({
    ClientId: clientId,
    UserPoolId: userPoolId,
    AuthFlow: AuthFlowType.ADMIN_USER_PASSWORD_AUTH,
    AuthParameters: { USERNAME: username, PASSWORD: password },
  });

  return client.send(command);
};

export const adminGetUser = async ({ region, userPoolId, username }: AdminGetUserRequest) => {
  const client = createClientForDefaultRegion(region);

  const command = new AdminGetUserCommand({
    UserPoolId: userPoolId,
    Username: username,
  });

  return client.send(command);
};

export const adminRegisterUser = async ({ region, clientId, username, password, email }: AdminRegisterUserRequest) => {
  const client = createClientForDefaultRegion(region);

  const command = new SignUpCommand({
    ClientId: clientId,
    Username: username,
    Password: password,
    UserAttributes: [{ Name: 'email', Value: email }],
  });

  return client.send(command);
};

export const adminUserSignOut = (region: string, { UserPoolId, Username }: AdminUserGlobalSignOutCommand['input']) => {
  const client = createClientForDefaultRegion(region);

  const command = new AdminUserGlobalSignOutCommand({
    UserPoolId,
    Username,
  });

  return client.send(command);
};
