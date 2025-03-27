import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { ModalManagerComponent } from "../../../standalone/modal-manager/modal-manager.component";
import { RouterModule } from '@angular/router';
import { SilentTokenRefreshService } from "../../identity/services/silent-token-refresh.service";
import { SignalRService } from "../../shared/services/signal-r.service";
import { RefreshTokenService } from "../../identity/services/refresh-token.service";
import { Store } from "@ngrx/store";
import { of } from "rxjs";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let silentTokenRefreshServiceMock: jasmine.SpyObj<SilentTokenRefreshService>;
  let signalRServiceMock: jasmine.SpyObj<SignalRService>;
  let refreshTokenServiceMock: jasmine.SpyObj<RefreshTokenService>;
  let mockStore: jasmine.SpyObj<Store>;

  beforeAll(() => {
    window.onbeforeunload = () => jasmine.createSpy();
    mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    mockStore.select.and.returnValue(of({ name: "MockData" }));

    silentTokenRefreshServiceMock = jasmine.createSpyObj('SilentTokenRefreshService', ['']);
    signalRServiceMock = jasmine.createSpyObj('SignalRService', ['']);
    refreshTokenServiceMock = jasmine.createSpyObj('RefreshTokenService', ['']);
  });
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterModule, ModalManagerComponent],
      providers: [
        { provide: SilentTokenRefreshService, useValue: silentTokenRefreshServiceMock },
        { provide: SignalRService, useValue: signalRServiceMock },
        { provide: RefreshTokenService, useValue: refreshTokenServiceMock },
        { provide: Store, useValue: mockStore }
      ]
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    
    fixture.detectChanges();
  });

  it('should create', () =>{
    expect(component).toBeTruthy();
  });

  it('executes before the page unloads', () => {
    window.dispatchEvent(new Event('beforeunload'));
    expect(mockStore.dispatch).toHaveBeenCalled();
  })
});