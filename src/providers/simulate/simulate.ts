import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
declare var google : any;

@Injectable()
export class SimulateService {

  public directionsService;
  public myRoute;
  public myRouteIndex;

  constructor() {
    console.log('Hello SimulateProvider Provider');
    this.directionsService =  new google.maps.DirectionsService();
  }

  riderPickUp(){
    //simulate rider picked up after 1second
    return Observable.timer(1000)
  }

  riderDropprdOff(){
      //simulate rider dropped off after 1second
      return Observable.timer(1000)
  }

  getPickupCar(){

    return new Observable(observable => {

      let car = this.myRoute[this.myRouteIndex];
      observable.next(car);
      this.myRouteIndex++;
    })
  }


  getSegmentedDirections(directions){
    let route = directions.routes[0];
    let legs = route.legs;
    let path = [];
    let increments = [];
    let duration = 0;
    let numOfLegs = legs.length;

    while(numOfLegs--){
      let leg = legs[numOfLegs];
      let steps = leg.steps;
      let numOfSteps = steps.length;
    
      while(numOfSteps--){
        let step = steps[numOfSteps];
        let points = step.path;
        let numOfPoints = points.length;
        duration += step.duration.value;

        while(numOfPoints--){
          let point = points[numOfPoints];

          path.push(point);
          increments.unshift({
            position : point, // car position
            time : duration,// time left  brfore arrival
            path : path.slice(0) // clone array to prevent referencing final path array
          })
        }
      }
    }

    return increments;
  }


  calculateRoute(start, end){
    console.log("calculating routes");
    return new Observable(observable => {
      this.directionsService.route({
        origin: start,
        destination : end,
        travelMode : google.maps.TravelMode.DRIVING
      },(response, status) => {
        if(status === google.maps.DirectionsStatus.OK) {
          observable.next(response);
        }
        else{
          observable.error(status);
        }
      })
    })
  }

  simulateRoute(start, end){

    return new Observable(observable => {
      this.calculateRoute(start, end).subscribe(directions => {
        //get routr path
        this.myRoute = this.getSegmentedDirections(directions);
        // return pickup car
        this.getPickupCar().subscribe(car =>{
          observable.next(car);
        })
      })
    })
  }


  findPickupCar(pickuplocation){

    this.myRouteIndex = 0;

    let car = this.cars1.cars[0];
    let start = new google.maps.LatLng(car.coord.lat, car.coord.lng);
    let end = pickuplocation;

    return this.simulateRoute(start, end);
  }
  
  dropoffPickupCar(pickuplocation , dropoffLocation){
    return this.simulateRoute(pickuplocation, dropoffLocation);
  }

  getCars(lat, lng){
    
    let carData = this.cars[this.carIndex];

    this.carIndex++;

    if(this.carIndex > this.cars.length-1){
      this.carIndex = 0;
    }

    return new Observable(
      observer => {observer.next(carData);
    })
  }

  private carIndex: number = 0;

  private cars1 = {
    cars :[{
      id:1,
      coord:{
        lat:30.705353,
        lng:76.763227
      }
    },
    {
      id:2,
      coord:{
        lat:30.705667,
        lng:76.763753
      }
    }]
  };

  private cars2 = {
    cars :[{
      id:1,
      coord:{
        lat:30.706073,
        lng:76.764696
      }
    },
    {
      id:2,
      coord:{
        lat:30.706931,
        lng:76.766112
      }
    }]
  };

  private cars3 = {
    cars :[{
      id:1,
      coord:{
        lat:30.704615,
        lng:76.762466
      }
    },
    {
      id:2,
      coord:{
        lat:30.703961,
        lng:76.761200
      }
    }]
  };

  private cars4 = {
    cars :[{
      id:1,
      coord:{
        lat:30.703139,
        lng:76.760031
      }
    },
    {
      id:2,
      coord:{
        lat:30.702152,
        lng:76.758487
      }
    }]
  };

  private cars5 = {
    cars :[{
      id:1,
      coord:{
        lat:30.703324,
        lng:76.762326
      }
    },
    {
      id:2,
      coord:{
        lat:30.703296,
        lng:76.763227
      }
    }]
  };

  private cars : Array<any> = [this.cars1,this.cars2,this.cars3,this.cars4,this.cars5,]
}
