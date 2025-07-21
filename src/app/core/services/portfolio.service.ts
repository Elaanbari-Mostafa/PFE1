import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { 
  InformationsPersonnellesService,
  CompetencesService,
  ProjetsService,
  ExperiencesService,
  EducationsService,
  TemoignagesService,
  ServicesPortfolioService,
  ReseauxSociauxService,
  TypesService,
  PortfolioManagementService
} from './portfolio/index';

import { 
  InformationPersonnelle, 
  Competence, 
  TypeCompetence, 
  Projet, 
  TypeProjet,
  Experience, 
  Education, 
  Temoignage, 
  Service, 
  ReseauSocial,
  Portfolio 
} from '../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  
  constructor(
    private informationsService: InformationsPersonnellesService,
    private competencesService: CompetencesService,
    private projetsService: ProjetsService,
    private experiencesService: ExperiencesService,
    private educationsService: EducationsService,
    private temoignagesService: TemoignagesService,
    private servicesService: ServicesPortfolioService,
    private reseauxService: ReseauxSociauxService,
    private typesService: TypesService,
    private portfolioManagementService: PortfolioManagementService
  ) {
    this.initializeMockData();
  }
  
  private initializeMockData(): void {
    this.competencesService.loadMockData();
    this.projetsService.loadMockData();
    this.experiencesService.loadMockData();
    this.educationsService.loadMockData();
    this.temoignagesService.loadMockData();
    this.servicesService.loadMockData();
    this.reseauxService.loadMockData();
    this.typesService.loadMockData();
    this.portfolioManagementService.loadMockData();
  }
  
  // Informations Personnelles
  getInformationsPersonnelles() { 
    return this.informationsService.getInformationsPersonnelles(); 
  }
  
  updateInformationsPersonnelles(data: Partial<InformationPersonnelle>): Observable<InformationPersonnelle> {
    return this.informationsService.updateInformationsPersonnelles(data);
  }
  
  // Compétences
  getCompetences() { 
    return this.competencesService.getCompetences(); 
  }
  
  addCompetence(competence: Omit<Competence, 'id'>): Observable<Competence> {
    return this.competencesService.addCompetence(competence);
  }
  
  updateCompetence(id: string, data: Partial<Competence>): Observable<Competence> {
    return this.competencesService.updateCompetence(id, data);
  }
  
  deleteCompetence(id: string): Observable<boolean> {
    return this.competencesService.deleteCompetence(id);
  }
  
  // Projets
  getProjets() { 
    return this.projetsService.getProjets(); 
  }
  
  addProjet(projet: Omit<Projet, 'id'>): Observable<Projet> {
    return this.projetsService.addProjet(projet);
  }
  
  updateProjet(id: string, data: Partial<Projet>): Observable<Projet> {
    return this.projetsService.updateProjet(id, data);
  }
  
  deleteProjet(id: string): Observable<boolean> {
    return this.projetsService.deleteProjet(id);
  }
  
  // Expériences
  getExperiences() { 
    return this.experiencesService.getExperiences(); 
  }
  
  addExperience(experience: Omit<Experience, 'id'>): Observable<Experience> {
    return this.experiencesService.addExperience(experience);
  }
  
  updateExperience(id: string, data: Partial<Experience>): Observable<Experience> {
    return this.experiencesService.updateExperience(id, data);
  }
  
  deleteExperience(id: string): Observable<boolean> {
    return this.experiencesService.deleteExperience(id);
  }
  
  // Éducations
  getEducations() { 
    return this.educationsService.getEducations(); 
  }
  
  addEducation(education: Omit<Education, 'id'>): Observable<Education> {
    return this.educationsService.addEducation(education);
  }
  
  updateEducation(id: string, data: Partial<Education>): Observable<Education> {
    return this.educationsService.updateEducation(id, data);
  }
  
  deleteEducation(id: string): Observable<boolean> {
    return this.educationsService.deleteEducation(id);
  }
  
  // Témoignages
  getTemoignages() { 
    return this.temoignagesService.getTemoignages(); 
  }
  
  addTemoignage(temoignage: Omit<Temoignage, 'id'>): Observable<Temoignage> {
    return this.temoignagesService.addTemoignage(temoignage);
  }
  
  updateTemoignage(id: string, data: Partial<Temoignage>): Observable<Temoignage> {
    return this.temoignagesService.updateTemoignage(id, data);
  }
  
  deleteTemoignage(id: string): Observable<boolean> {
    return this.temoignagesService.deleteTemoignage(id);
  }
  
  // Services
  getServices() { 
    return this.servicesService.getServices(); 
  }
  
  addService(service: Omit<Service, 'id'>): Observable<Service> {
    return this.servicesService.addService(service);
  }
  
  updateService(id: string, data: Partial<Service>): Observable<Service> {
    return this.servicesService.updateService(id, data);
  }
  
  deleteService(id: string): Observable<boolean> {
    return this.servicesService.deleteService(id);
  }
  
  // Réseaux Sociaux
  getReseauxSociaux() { 
    return this.reseauxService.getReseauxSociaux(); 
  }
  
  addReseauSocial(reseau: Omit<ReseauSocial, 'id'>): Observable<ReseauSocial> {
    return this.reseauxService.addReseauSocial(reseau);
  }
  
  updateReseauSocial(id: string, data: Partial<ReseauSocial>): Observable<ReseauSocial> {
    return this.reseauxService.updateReseauSocial(id, data);
  }
  
  deleteReseauSocial(id: string): Observable<boolean> {
    return this.reseauxService.deleteReseauSocial(id);
  }
  
  // Types
  getTypesCompetences(): Observable<TypeCompetence[]> {
    return this.typesService.getTypesCompetences();
  }
  
  getTypesProjets(): Observable<TypeProjet[]> {
    return this.typesService.getTypesProjets();
  }
  
  addTypeCompetence(type: Omit<TypeCompetence, 'id'>): Observable<TypeCompetence> {
    return this.typesService.addTypeCompetence(type);
  }
  
  updateTypeCompetence(id: string, data: Partial<TypeCompetence>): Observable<TypeCompetence> {
    return this.typesService.updateTypeCompetence(id, data);
  }
  
  deleteTypeCompetence(id: string): Observable<boolean> {
    return this.typesService.deleteTypeCompetence(id);
  }
  
  addTypeProjet(type: Omit<TypeProjet, 'id'>): Observable<TypeProjet> {
    return this.typesService.addTypeProjet(type);
  }
  
  updateTypeProjet(id: string, data: Partial<TypeProjet>): Observable<TypeProjet> {
    return this.typesService.updateTypeProjet(id, data);
  }
  
  deleteTypeProjet(id: string): Observable<boolean> {
    return this.typesService.deleteTypeProjet(id);
  }
  
  // Portfolio Management
  getPortfolios() { 
    return this.portfolioManagementService.getPortfolios(); 
  }
  
  createPortfolio(data: Omit<Portfolio, 'id' | 'dateCreation' | 'derniereModification' | 'vues'>): Observable<Portfolio> {
    return this.portfolioManagementService.createPortfolio(data);
  }
  
  updatePortfolioStatus(portfolioId: string, statut: 'actif' | 'brouillon' | 'archive'): Observable<Portfolio> {
    return this.portfolioManagementService.updatePortfolioStatus(portfolioId, statut);
  }
  
  updatePortfolioVisibility(portfolioId: string, isPublic: boolean): Observable<Portfolio> {
    return this.portfolioManagementService.updatePortfolioVisibility(portfolioId, isPublic);
  }
  
  deletePortfolio(portfolioId: string): Observable<boolean> {
    return this.portfolioManagementService.deletePortfolio(portfolioId);
  }
}