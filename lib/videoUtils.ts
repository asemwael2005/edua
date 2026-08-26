/**
 * Video Utilities
 */

// URL Normalization & Security Validation Helper
export const normalizeAndValidateUrl = (url: string): string | null => {
  if (!url || typeof url !== 'string') return null;
  let trimmed = url.trim();
  if (!trimmed) return null;

  // Reject malicious pseudo-protocols
  if (/^(javascript|data|file|vbscript):/i.test(trimmed)) {
    return null;
  }

  // Auto-prefix missing http/https protocol
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
    return null;
  } catch (e) {
    return null;
  }
};

// Video Embed & Playback Helper Utility
export const getEmbedVideoUrl = (url: string): { embedUrl: string; isIframe: boolean } => {
  if (!url || typeof url !== 'string') {
    return { embedUrl: '', isIframe: false };
  }

  let trimmed = url.trim();
  if (!trimmed) return { embedUrl: '', isIframe: false };

  // 1. YouTube links: watch?v=ID, youtu.be/ID, embed/ID
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/i);
  if (ytMatch && ytMatch[1]) {
    return {
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      isIframe: true,
    };
  }

  // 2. Google Drive links: drive.google.com/file/d/FILE_ID/view
  const driveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveMatch && driveMatch[1]) {
    return {
      embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
      isIframe: true,
    };
  }

  // 3. Vimeo links: vimeo.com/ID
  const vimeoMatch = trimmed.match(/vimeo\.com\/([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      isIframe: true,
    };
  }

  // 4. Default direct MP4/WebM or existing embed iframe URLs
  const isIframe = trimmed.includes('embed') || trimmed.includes('iframe') || trimmed.includes('drive.google');
  return {
    embedUrl: trimmed,
    isIframe,
  };
};
