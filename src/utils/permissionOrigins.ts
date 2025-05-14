interface GetPermissionOriginsOptions {
  subdomains?: boolean;
  secure?: boolean;
}

const defaultOptions: GetPermissionOriginsOptions = {
  subdomains: true,
  secure: false,
};

/**
 * 从URL生成权限origin列表
 * @param url 目标URL
 * @returns 权限origin数组
 */
export function getPermissionOrigins(
  url: string,
  options: GetPermissionOriginsOptions = defaultOptions,
): string[] {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const protocol = options.secure ? urlObj.protocol : '*:';
    const hostParts = hostname.split('.');
    if (hostParts.length < 2) {
      return [`${protocol}//${hostname}/*`];
    }
    const mainDomain = hostParts.slice(-2).join('.');
    const origins = [`${protocol}//${hostname}/*`, `${protocol}//*.${mainDomain}/*`];
    return origins;
  } catch (error) {
    return [`${url}/*`];
  }
}
