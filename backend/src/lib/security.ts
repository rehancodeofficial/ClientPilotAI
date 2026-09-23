import { URL } from 'url';
import net from 'net';

/**
 * Validates a target URL against Server-Side Request Forgery (SSRF).
 * Blocks:
 * - Localhost / loopback (127.0.0.0/8, ::1)
 * - Private RFC1918 IPv4 ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
 * - Link-local & Cloud metadata endpoints (169.254.0.0/16)
 * - Broadcast & Zero addresses (0.0.0.0, 255.255.255.255)
 * - Internal / private hostnames (.local, .internal, .lan, localhost)
 * - Non-HTTP/HTTPS protocols
 */
export function isSafePublicUrl(inputUrl: string): boolean {
  try {
    const parsed = new URL(inputUrl);

    // Only allow standard web protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase().trim();

    if (!hostname) {
      return false;
    }

    // Disallow localhost or loopback names
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.lan') ||
      hostname.endsWith('.corp') ||
      hostname.endsWith('.home')
    ) {
      return false;
    }

    // Check IP addresses directly
    if (net.isIP(hostname)) {
      if (isPrivateOrRestrictedIp(hostname)) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if an IP address falls into private, loopback, or metadata ranges.
 */
export function isPrivateOrRestrictedIp(ip: string): boolean {
  if (ip === '127.0.0.1' || ip === '::1' || ip === '0.0.0.0') {
    return true;
  }

  // IPv4 checks
  if (net.isIPv4(ip)) {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some(isNaN)) return true;

    // 127.0.0.0/8 (Loopback)
    if (parts[0] === 127) return true;

    // 10.0.0.0/8 (Private)
    if (parts[0] === 10) return true;

    // 172.16.0.0/12 (Private: 172.16.0.0 – 172.31.255.255)
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;

    // 192.168.0.0/16 (Private)
    if (parts[0] === 192 && parts[1] === 168) return true;

    // 169.254.0.0/16 (Link-local & AWS/GCP/Azure metadata 169.254.169.254)
    if (parts[0] === 169 && parts[1] === 254) return true;

    // 0.0.0.0/8
    if (parts[0] === 0) return true;

    // 224.0.0.0/4 (Multicast) and 240.0.0.0/4 (Reserved)
    if (parts[0] >= 224) return true;
  }

  return false;
}
