import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ToastModule } from 'primeng/toast';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    // HeaderComponent,
    // FooterComponent,
    ScrollTopModule,
    ToastModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap(route => route.data)
      )
      .subscribe(data => {
        if (data['title']) {
          this.titleService.setTitle(data['title']);
        }
      });
  }
  // ngOnInit() {
  //   this.setupScrollAnimation();
  // }

  // setupScrollAnimation() {
  //   const observerOptions = {
  //     root: null,
  //     rootMargin: '0px',
  //     threshold: 0.1
  //   };

  //   const observer = new IntersectionObserver((entries) => {
  //     entries.forEach(entry => {
  //       if (entry.isIntersecting) {
  //         entry.target.classList.add('animated');
  //         observer.unobserve(entry.target);
  //       }
  //     });
  //   }, observerOptions);

  //   setTimeout(() => {
  //     const elements = document.querySelectorAll('.animate-on-scroll');
  //     elements.forEach(element => {
  //       observer.observe(element);
  //     });
  //   }, 100);
  // }
}