import {Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {ButtonNameEnum} from "src/app/enums/ButtonNameEnum";
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  @Output("activeButton") activeButtonEvent = new EventEmitter<ButtonNameEnum>();
  @ViewChild("navButtons") navButtons!: ElementRef;
  eButtonName = ButtonNameEnum;
  username : string = '';
  emailVerified: boolean = false;
  constructor(private render: Renderer2, private keycloakService: KeycloakService) {
  }

  ngOnInit(): void {
    this.keycloakService.loadUserProfile().then(
      (profile) => {
        this.username = profile.email ?? '';
        this.emailVerified = profile.emailVerified ?? true;
      }
    ).catch((err)=>{
      console.error(err);
    });
  }

  navButtonClick($event: MouseEvent, buttonName: ButtonNameEnum) {
    this.activeButtonEvent.emit(buttonName);
    this._setActiveLink($event);
  }

  /**
   * Сделать ссылку в navbar активной
   * @param $event
   * @private
   */
  private _setActiveLink($event: MouseEvent) {
    const children: HTMLCollection = this.navButtons.nativeElement.children;
    for (let i = 0; i < children.length; i++) {
      const href: Element | null = children.item(i);
      this.render.removeClass(href, "active");
    }
    const target = $event.target;
    this.render.addClass(target, "active");
  }
}
