'use strict'

const ldapServerDomain = process.env.LDAP_SERVER_DOMAIN
const ldapServerPort = process.env.LDAP_SERVER_PORT
const ldapAdminUsername = process.env.LDAP_ADMIN_USERNAME
const ldapAdminPassword = process.env.LDAP_ADMIN_PASSWORD
const nodeRedBaseUrl = process.env.NODE_RED_BASE_URL
const discoveryEnvId = process.env.DISCOVERY_ENV_ID
const discoveryCollectionId = process.env.DISCOVERY_COLLECTION_ID

const preferences = {
    tempClientId: 1
}

const cookieExpiration = 300000
const sessionSecret = process.env.SESSION_SECRET


module.exports = {
    cookieExpiration: cookieExpiration,
    sessionSecret: sessionSecret,
    ldapServerDomain: ldapServerDomain,
    ldapServerPort: ldapServerPort,
    ldapAdminUsername: ldapAdminUsername,
    ldapAdminPassword: ldapAdminPassword,
    nodeRedBaseUrl: nodeRedBaseUrl,
    discoveryEnvId: discoveryEnvId,
    discoveryCollectionId: discoveryCollectionId,
    preferences: preferences
}
