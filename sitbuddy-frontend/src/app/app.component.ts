import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'sitbuddy-frontend';

  public ngOnInit() {
      // fetch('http://localhost:3000/users')
      // .then(async response => console.log(await response.text()));
  }
}
