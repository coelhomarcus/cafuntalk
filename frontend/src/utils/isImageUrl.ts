export default function isImageUrl(text: string): boolean {
  try {
    const url = new URL(text);

    // Check for common image extensions in the pathname
    if (/\.(jpeg|jpg|gif|png|webp|bmp|svg|tiff|ico|avif)$/i.test(url.pathname)) {
      return true;
    }

    // Check for Google's encrypted images or similar services
    if (url.hostname.includes('encrypted-tbn') ||
      url.hostname.includes('gstatic.com') ||
      (url.pathname.includes('images') && url.search.includes('q='))) {
      return true;
    }

    // Common image hosting services
    const imageHostingServices = [
      'imgur.com', 'i.imgur.com',
      'flickr.com', 'staticflickr.com',
      'photobucket.com',
      'giphy.com', 'media.giphy.com',
      'tenor.com', 'media1.tenor.com',
      'cloudinary.com',
      'imgix.net',
      'imagekit.io',
      'postimg.cc', 'i.postimg.cc',
      'imgbb.com', 'i.ibb.co'
    ];

    if (imageHostingServices.some(service => url.hostname.includes(service))) {
      return true;
    }

    // Social media images
    if (
      (url.hostname.includes('fbcdn.net') || url.hostname.includes('facebook.com')) ||
      (url.hostname.includes('twimg.com') || url.hostname.includes('pbs.twimg.com')) ||
      (url.hostname.includes('cdninstagram.com') || url.hostname.includes('instagram.com'))
    ) {
      return true;
    }

    // Common image-related paths and parameters
    if (
      url.pathname.includes('/image') ||
      url.pathname.includes('/photo') ||
      url.pathname.includes('/render') ||
      url.pathname.includes('/thumbnail') ||
      url.pathname.includes('/preview') ||
      url.search.includes('width=') ||
      url.search.includes('height=') ||
      url.search.includes('image') ||
      url.search.includes('media')
    ) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}
