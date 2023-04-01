import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit{

  public name:any
  public questionList:any =[]
  public currentQuestion:number =0
  points:number=0
  counter:number =60
  correctAnswer:number =0
  incorrectAnswer:number=0
  interval$:any
  progress:string="0"
  isQuizCompleted:boolean =false


  constructor(private questionService:QuestionService){}

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!
    this.getQuestions()
    this.startcounter()
  }

  getQuestions(){
    this.questionService.getQuestion().subscribe((item:any)=>{
      this.questionList=item.questions
    })
  }

  nextQuestion(){
    this.currentQuestion++
  }
  prevQuestion(){
    this.currentQuestion--
  }

  answer(currentQno:number,option:any){
    if(currentQno== this.questionList.length){
      this.isQuizCompleted=true
      this.stopcounter()
    }

    if(option.correct){
      this.points+=10
      this.correctAnswer++
      setTimeout(() => {
        this.currentQuestion++
      this.resetcounter()
      this.getProgress()
      }, 1000);
      
    }
    else{
      this.points-=10
      setTimeout(() => {
        this.incorrectAnswer++
      this.currentQuestion++
      this.resetcounter()
      this.getProgress()
      }, 1000);
      
    }
  }


  startcounter(){
    this.interval$=interval(1000).subscribe(item=>{
      this.counter--
      if(this.counter===0){
        this.currentQuestion++
        this.counter=60
        this.points-=10
      }
    })
    setTimeout(() => {
      this.interval$.unsubscribe()
    }, 60000);
  }


  stopcounter(){
    this.interval$.unsubscribe();
    this.counter=0
  }
  resetcounter(){
    this.stopcounter()
    this.counter=60
    this.startcounter()
  }

  resetQuiz(){
    this.resetcounter()
    this.getQuestions()
    this.points=0
    this.counter=60
    this.currentQuestion=0
  }

  getProgress(){
    this.progress = ((this.currentQuestion/this.questionList.length)*100).toString()
    return this.progress
  }

}
