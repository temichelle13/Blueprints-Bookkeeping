const BASE_URL = "https://blueprintsandbookkeeping.com";

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#business`,
    name: "Blueprints & Bookkeeping, LLC",
    description:
      "Advanced bookkeeping and professional business plans for complex, high-growth businesses.",
    url: BASE_URL,
    telephone: "+1-541-319-8654",
    email: "tea@blueprintsandbookkeeping.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Roseburg",
      addressRegion: "OR",
      addressCountry: "US",
    },
    areaServed: [
      {
        "@type": "State",
        name: "Oregon",
      },
      {
        "@type": "Country",
        name: "United States",
      },
    ],
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
    sameAs: [],
  };
}

export function homepageSchemas() {
  return [
    localBusinessSchema(),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${BASE_URL}/#webpage`,
      url: BASE_URL,
      name: "Roseburg Bookkeeping, Cleanup, Monthly Close & Business Plans",
      description:
        "Roseburg, Oregon bookkeeping firm serving clients nationwide with cleanup bookkeeping, monthly close support, and professionally written business plans.",
      isPartOf: {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: BASE_URL,
        name: "Blueprints & Bookkeeping",
      },
      about: {
        "@id": `${BASE_URL}/#business`,
      },
      primaryImageOfPage: `${BASE_URL}/opengraph.jpg`,
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${BASE_URL}/#service-bookkeeping`,
      serviceType: "Bookkeeping",
      name: "Advanced Bookkeeping Services",
      description:
        "Advanced bookkeeping services including cleanup/catch-up projects, monthly close workflows, reconciliations, and ongoing reporting for founders and business owners.",
      provider: {
        "@id": `${BASE_URL}/#business`,
      },
      areaServed: [
        {
          "@type": "City",
          name: "Roseburg",
        },
        {
          "@type": "State",
          name: "Oregon",
        },
        {
          "@type": "Country",
          name: "United States",
        },
      ],
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: `${BASE_URL}/services/bookkeeping`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${BASE_URL}/#service-business-plans`,
      serviceType: "Business Plan Development",
      name: "Business Plan Services",
      description:
        "Professional business plans with financial forecasting, market analysis, and strategic narratives for startups, acquisitions, and growth-stage businesses.",
      provider: {
        "@id": `${BASE_URL}/#business`,
      },
      areaServed: {
        "@type": "Country",
        name: "United States",
      },
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: `${BASE_URL}/services/business-plans`,
      },
    },
  ];
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    provider: {
      "@type": "LocalBusiness",
      name: "Blueprints & Bookkeeping, LLC",
      url: BASE_URL,
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
  };
}

export function faqPageSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
