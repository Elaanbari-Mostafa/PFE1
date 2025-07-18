export interface InformationPersonnelle {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  adresse: string;
  dateNaissance?: Date;
  nomUtilisateur: string;
  titrePro: string;
  descPro: string;
  nationalite?: string;
  pays: string;
  ville: string;
  languages: string[];
  photoProfilOriginalePath?: string;
  photoProfilSecondairePath?: string;
  projetsTermines: number;
  recompenses: number;
  clientsSatisfaits: number;
  anneesExperience: number;
  description?: string;
  utilisateurId: string;
}

export interface Competence {
  id: string;
  nom: string;
  niveau: number; // 1 to 100
  typeCompetenceId: string;
  utilisateurId: string;
}

export interface TypeCompetence {
  id: string;
  nom: string;
  utilisateurId: string;
}

export interface Projet {
  id: string;
  titre: string;
  description: string;
  technologies: string[];
  lienDemo?: string;
  projetImage?: string;
  typeProjetId: string;
  utilisateurId: string;
}

export interface TypeProjet {
  id: string;
  nom: string;
  utilisateurId: string;
}

export interface Experience {
  id: string;
  entreprise: string;
  poste: string;
  description: string;
  dateDebut: Date;
  dateFin?: Date;
  lieu?: string;
  utilisateurId: string;
}

export interface Education {
  id: string;
  institution: string;
  diplome: string;
  lieu: string;
  dateDebut: Date;
  dateFin?: Date;
  description?: string;
  utilisateurId: string;
}

export interface Temoignage {
  id: string;
  auteur: string;
  poste: string;
  entreprise: string;
  contenu: string;
  rate: number; // 1 to 5 stars
  photo?: string;
  dateCreation: Date;
  utilisateurId: string;
}

export interface Service {
  id: string;
  nom: string;
  description: string;
  icone: string;
  utilisateurId: string;
}

export interface ReseauSocial {
  id: string;
  nom: string;
  url: string;
  icone?: string;
  utilisateurId: string;
}

export interface Portfolio {
  id: string;
  nom: string;
  url: string;
  template: string;
  statut: 'actif' | 'brouillon' | 'archive';
  dateCreation: Date;
  derniereModification: Date;
  vues: number;
  utilisateurId: string;
  isPublic: boolean;
}