export const contact = {
  brand: "Casero Cancún",
  whatsappDisplay: "+52 990 402 8923",
  whatsappLinkNumber: "529904028923",
  email: "info@caserocancun.com",
  location: "Cancún, Quintana Roo",
  whatsappText: "Hola, vengo de Casero Cancún y quiero información.",
};

export const whatsappUrl = `https://wa.me/${contact.whatsappLinkNumber}?text=${encodeURIComponent(
  contact.whatsappText,
)}`;
