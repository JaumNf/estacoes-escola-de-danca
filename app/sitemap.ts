import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Defina NEXT_PUBLIC_BASE_URL na Vercel quando o domínio próprio entrar no ar.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://escoladedancaestacoes.vercel.app';

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/aulas-regulares`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cursos-intensivos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/baile`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/politica-de-privacidade`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
