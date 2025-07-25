import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  portfoliosCreated: number;
}

interface RecentActivity {
  id: string;
  type: 'user_registration' | 'subscription_created' | 'portfolio_created';
  description: string;
  timestamp: Date;
  user: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ChartModule,
    TableModule,
    TagModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats: AdminStats = {
    totalUsers: 1247,
    activeSubscriptions: 892,
    totalRevenue: 18450,
    portfoliosCreated: 1156
  };

  recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'user_registration',
      description: 'Nouvel utilisateur inscrit',
      timestamp: new Date(),
      user: 'SALMA CHLILI'
    },
    {
      id: '2',
      type: 'subscription_created',
      description: 'Abonnement mensuel souscrit',
      timestamp: new Date(Date.now() - 3600000),
      user: 'AHMAD MOHAMED'
    },
    {
      id: '3',
      type: 'subscription_created',
      description: 'Abonnement annuel souscrit',
      timestamp: new Date(Date.now() - 7200000),
      user: 'E LAANBARI MOSTAFA'
    }
  ];

  revenueChartData: any;
  chartOptions: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.initializeChartData();
  }

  initializeChartData() {
    this.revenueChartData = {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
      datasets: [
        {
          label: 'Revenus (MAD)',
          data: [40, 50, 100, 240, 500, 1000,2500],
          fill: true,
          borderColor: 'var(--primary-color)',
          tension: 0.4
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
       maintainAspectRatio: false,
  aspectRatio: 2, // Width/height ratio
      //  maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  getActivityTypeLabel(type: string): string {
    switch (type) {
      case 'user_registration': return 'Inscription';
      case 'subscription_created': return 'Abonnement';
      case 'portfolio_created': return 'Portfolio';
      default: return type;
    }
  }

  getActivityTypeSeverity(type: string): string {
    switch (type) {
      case 'user_registration': return 'success';
      case 'subscription_created': return 'info';
      case 'portfolio_created': return 'warn';
      default: return 'secondary';
    }
  }
}