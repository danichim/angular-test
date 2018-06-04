import { Component } from '@angular/core';

@Component({
  template: '<h2 class="text-center">Page not found 404 </h2>'+
  '<br/><a [routerLink]="[\'/\']" class="btn btn-link">Back to main</a>'
})
export class PageNotFoundComponent {}
