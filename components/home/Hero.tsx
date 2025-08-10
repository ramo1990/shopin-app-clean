import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-white py-24 h-screen flex items-center justify-center">

      {/* Le conteneur principal doit correspondre à celui du NavBar */}
      <div className="max-w-3xl">
        {/* Badge ou intro */}

        {/* Titre principal */}
        <h1 className="text-5xl font-bold mb-4">
          Trouve le produit idéal pour <br className="hidden md:block" />
          chaque occasion
        </h1>

        {/* Paragraphe descriptif */}
        <p className="text-lg text-gray-700">
          Une large sélection de produits de qualité pour améliorer ton quotidien 
          avec style, efficacité et plaisir.
        </p>

        {/* Bouton principal */}
        <a
          href="#product_section"
          className="inline-block bg-blue-600 text-white px-10 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition duration-300 shadow-md"
        >
          Explorer maintenant
        </a>
      </div>
    </section>
  );
};

export default Hero;




