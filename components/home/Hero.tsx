import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-white py-20 md:py-28 min-h-[70vh] flex items-center justify-center text-center md:text-left">

      {/* Le conteneur principal doit correspondre à celui du NavBar */}
      <div className="max-w-3xl px-4 md:px-0">
        {/* Badge ou intro */}
        {/* Exemple : <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-4">Nouveautés</span> */}

        {/* Titre principal */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-gray-900">
          Trouve le produit idéal pour <br className="hidden md:block" />
          chaque occasion
        </h1>

        {/* Paragraphe descriptif */}
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
          Une large sélection de produits de qualité pour améliorer ton quotidien 
          avec style, efficacité et plaisir.
        </p>

        {/* Bouton principal */}
        <a
          href="#product_section"
          className="inline-block bg-blue-600 text-white px-8 md:px-10 py-3 md:py-4 rounded-lg text-lg font-medium shadow-lg hover:shadow-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
        >
          Explorer maintenant
        </a>
      </div>
    </section>
  );
};

export default Hero;




