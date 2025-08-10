export function getFullImageUrl(image: string | null | undefined): string {
  // const baseUrl = 'http://127.0.0.1:8000'; // local
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000'

  if (!image || image === 'null' || image === 'undefined') {
    return '/casquette.jpeg'; // fallback local
  }

  try {
    // Si déjà une URL complète, retourne-la telle quelle
    const url = new URL(image);
    return url.href;
  } catch {
    // Sinon, on vérifie si ça commence par /media
    if (image.startsWith('/media')) {
      return `${baseUrl}${image}`;
    }
    // Sinon on suppose que c’est un chemin type "categories/image.jpg"
    return `${baseUrl}/media/${image}`;
  }
}
