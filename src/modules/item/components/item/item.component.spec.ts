import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ItemComponent } from "./item.component";
import { NavigationService } from '../../../shared/services/navigation.service';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Item } from '../../models/responses/item';

describe('ItemComponent', () => {
  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;
  let mockStore: jasmine.SpyObj<Store>;

  beforeAll(() => {
    mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    mockStore.select.and.returnValue(of({ name: "MockData" }));
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemComponent],
      providers: [
        { provide: NavigationService, useValue: NavigationService },
        { provide: Store, useValue: mockStore }
      ]
    })
    .overrideComponent(ItemComponent, {
      remove: { imports: [] },
      add: { imports: [] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // item observable

  it('should display item data once the item was loaded', () => {
    const itemMock = new Item({ id: 'ItemId', name: 'ItemName', description: 'ItemDescription' });
    
    component.item$ = of(itemMock);

    fixture.detectChanges();
    const itemNameDiv = fixture.debugElement.query(By.css('[data-test-id="item-name"]'))?.nativeElement;
    const itemDescriptionDiv = fixture.debugElement.query(By.css('[data-test-id="item-description"]'))?.nativeElement;
  
    expect(itemNameDiv).toBeTruthy();
    expect(itemDescriptionDiv).toBeTruthy();

    expect(itemDescriptionDiv.textContent).toContain(itemMock.description);
    expect(itemNameDiv.textContent).toContain(itemMock.name);
  });

  // item controls

  it('should display the control buttons if `hasControls` input is set to true', () => {
    component.hasControls = true;

    fixture.detectChanges();

    const controlsDiv = fixture.debugElement.query(By.css('[data-test-id="item-controls"]'))?.nativeElement;

    expect(controlsDiv).toBeTruthy();
  });

  it('should not display the control buttons if `hasControls` input is set to false', () => {
    component.hasControls = false;

    fixture.detectChanges();

    const controlsDiv = fixture.debugElement.query(By.css('[data-test-id="item-controls"]'))?.nativeElement;

    expect(controlsDiv).toBeFalsy();
  });
});
