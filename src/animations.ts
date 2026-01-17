import { trigger, transition, style, animate, query } from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0 })
    ], { optional: true }),
    query(':leave', [
      animate('200ms', style({ opacity: 0 }))
    ], { optional: true }),
    query(':enter', [
      animate('300ms', style({ opacity: 1 }))
    ], { optional: true })
  ])
]);

export const slideInAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':enter', [
      style({ left: '100%', opacity: 0 })
    ], { optional: true }),
    query(':leave', [
      animate('200ms ease-out', style({ left: '-100%', opacity: 0 }))
    ], { optional: true }),
    query(':enter', [
      animate('300ms ease-out', style({ left: '0%', opacity: 1 }))
    ], { optional: true })
  ])
]);

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(10px)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
  ])
]);

