// IMPORTANT: this is a plugin which requires jQuery for initialisation and data manipulation

import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormArray} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormBuilder} from '@angular/forms';
import {TestsService} from '../tests.service'
import {QuestionsService} from '../../questions/questions.service'
import {CandidatesService} from '../../candidates/candidates.service'
import { NotificationsComponent } from 'app/notifications/notifications.component';
import { TagService } from '../../tag/tag.service';
import { RelatedTagInfo } from '../../tag/tag-type/tag-type.model';
import { Tag } from 'app/tag/tag.model';
import { Candidate } from '../../candidates/candidate.model';
import { TableData } from 'app/data-table/data-table.model';
import swal from 'sweetalert2';
import { FileSaverService } from 'ngx-filesaver';
import * as moment from 'moment';
import { SharedService } from 'app/shared/shared.service';
import { environment } from 'environments/environment';



declare const $: any;
interface FileReaderEventTarget extends EventTarget {
    result: string;
}

interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;
    getMessage(): string;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
    selector: 'app-wizard-cmp',
    templateUrl: 'wizard.component.html',
    styleUrls: ['wizard.component.css']
})

export class TestWizardComponent implements OnInit, OnChanges, AfterViewInit {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();

  public test: any;

  type: FormGroup;
  technologies: Tag[];
  technologiesFormArray: FormArray;
  groupedTechnologies: any[];
  selectedTechnologies: any[];
  duration: 0;
  expiryTimeDisplayFormat = 'M/D/YYYY, h:mm A';
  selectedTime = undefined;

  _approxTime = 0;
    days = 0;
    hrs = 0;
    minutes = 0;
    seconds = 0;
    get approxTime() {
        return this._approxTime;
    };
    set approxTime(seconds) {
        this._approxTime = seconds;
        this.days = Math.floor(seconds / (3600 * 24));
        seconds -= this.days * 3600 * 24;
        this.hrs = Math.floor(seconds / 3600);
        seconds -= this.hrs * 3600;
        this.minutes = Math.floor(seconds / 60);
        seconds -= this.minutes * 60;
        this.seconds = seconds;
    }
    selectedQuestion = [];

  /*
    QUESTION RELATED VARIABLES
  */
  private QUES_LIMIT = 8;
  private QUES_OFFSET = 0;
  private QUES_TOTAL_RECORDS = -1;
  private quesTagIds: Set<number>;
  private quesLimit: number;
  private quesOffset: number;
  private quesTotalRecords: number;
  public questions: Array<any>;

  /*
    CANDIDATE DATA TABLE RELATED VARIABLES
  */
 dataTableTitle: string;
 tableData: TableData<Candidate> = <TableData<Candidate>>{
     headerRow : ['name', 'email'],
     dataRows : []
 };

  constructor(private formBuilder: FormBuilder, private _testService: TestsService,
            private _candidateService: CandidatesService, private _questionService: QuestionsService,
            private tagService: TagService, private notificationComponent: NotificationsComponent,
            private _FileSaverService: FileSaverService, private sharedService: SharedService) {
      this.dataTableTitle = 'Candidates';
      this.init();
  }

  private init() {
    this.questions = new Array<any>();
    this.quesTagIds = new Set<number>();
    this.quesLimit = this.QUES_LIMIT;
    this.quesOffset = this.QUES_OFFSET;
    this.quesTotalRecords = this.QUES_TOTAL_RECORDS;
  }

    updateCandidateTableData(candidates: Candidate[]): any {
        if (candidates) {
            // const fullData = this.tableData.dataRows;
            const fullData = [];
            for (let idx = 0; idx < candidates.length; idx++) {
                const candidate = candidates[idx];
                fullData.push(candidate);
            }
            const tableData: TableData<Candidate> = <TableData<Candidate>>{
                headerRow : this.tableData.headerRow,
                dataRows: fullData
            }
            this.tableData = tableData;
        }
    }

    downloadCandidateTemplate() {
        this._candidateService.downloadCandidateTemplate().subscribe(
            data => {
                this._FileSaverService.save(data, 'candidate-template.csv');
            }
        );
    }

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field).valid && form.get(field).touched;
  }

  displayFieldCss(form: FormGroup, field: string) {
    return {
      'has-error': this.isFieldValid(form, field),
      'has-feedback': this.isFieldValid(form, field)
    };
  }

  public updateTest(data) {
    this.test = data ;
    const selectedQuestion = this.getQuestionIds();
    for (let i = 0 ; i < selectedQuestion.length ; i++ ){
        this._testService.addTestQuestions( this.test.id , selectedQuestion[i] ).subscribe(
          data => { console.log(data); },
          err => { this.alertFn(err); } );
    }
    this.getCandidate();
  }

  public getCandidate() {
    this._candidateService.getCandidate($('#email').val()).subscribe(
          data => {
           this.updateCandidate(data[0]);
           },
          err => { this.alertFn(err); } );
  }

  public updateCandidate(data){
    this._testService.addTestCandidateId(data.id, this.test.id).subscribe(
          data => { console.log(data);
                    this.sendEmail(data);
                  },
          err => { this.alertFn(err); } );
  }

  public sendEmail(data){
    this._testService.sendEmail(data.id ).subscribe(
          data => { console.log(data);
                    alert('Test Successfully Created'); },
          err => { this.alertFn(err); } );
  }

  public alertFn(error){
    console.log(error);
    alert('Error getting Data');
  }

  ngOnInit() {
        let self = this;
        this.getTechnologyTagInfo();
        this.getAllGroupedRelatedTags();
        this.getQuestions();
        this.type = this.formBuilder.group({
            // To add a validator, we must first convert the string value into an array. The first item in the array is the default value if any, then the next item in the array is the validator. Here we are adding a required validator meaning that the firstName attribute must have a value in it.
            testName: [null, Validators.required],
            description: [null, Validators.required],
            technologiesFormArray: new FormArray([]),
            testHours: [0, Validators.required],
            testMinutes: [0, Validators.required],
            groupedTechnologiesForm: []
        });

        // Code for the Validator
        const $validator = $('.card-wizard form').validate({
            rules: {
                firstName: {
                    required: true
                },
                description: {
                    required: false
                },
                email: {
                    required: true,
                    minlength: 3,
                }
            },

            highlight: function(element) {
              $(element).closest('.form-group').removeClass('has-success').addClass('has-danger');
            },
            success: function(element) {
              $(element).closest('.form-group').removeClass('has-danger').addClass('has-success');
            },
            errorPlacement : function(error, element) {
              $(element).append(error);
            }
        });

        // Wizard Initialization
        $('.card-wizard').bootstrapWizard({
            'tabClass': 'nav nav-pills',
            'nextSelector': '.btn-next',
            'previousSelector': '.btn-previous',

            onNext: function(tab, navigation, index) {
                self.validateTab(index);
            },

            onInit: function(tab: any, navigation: any, index: any){

              // check number of tabs and fill the entire row
              let $total = navigation.find('li').length;
              let $wizard = navigation.closest('.card-wizard');

              let $first_li = navigation.find('li:first-child a').html();
              let $moving_div = $('<div class="moving-tab">' + $first_li + '</div>');
              $('.card-wizard .wizard-navigation').append($moving_div);

              $total = $wizard.find('.nav li').length;
             let  $li_width = 100/$total;

              let total_steps = $wizard.find('.nav li').length;
              let move_distance = $wizard.width() / total_steps;
              let index_temp = index;
              let vertical_level = 0;

              let mobile_device = $(document).width() < 600 && $total > 3;

              if(mobile_device){
                  move_distance = $wizard.width() / 2;
                  index_temp = index % 2;
                  $li_width = 50;
              }

              $wizard.find('.nav li').css('width',$li_width + '%');

              let step_width = move_distance;
              move_distance = move_distance * index_temp;

              let $current = index + 1;

              if($current == 1 || (mobile_device == true && (index % 2 == 0) )){
                  move_distance -= 8;
              } else if($current == total_steps || (mobile_device == true && (index % 2 == 1))){
                  move_distance += 8;
              }

              if(mobile_device){
                  let x: any = index / 2;
                  vertical_level = parseInt(x);
                  vertical_level = vertical_level * 38;
              }

              $wizard.find('.moving-tab').css('width', step_width);
              $('.moving-tab').css({
                  'transform':'translate3d(' + move_distance + 'px, ' + vertical_level +  'px, 0)',
                  'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

              });
              $('.moving-tab').css('transition','transform 0s');
           },

            onTabClick : function(tab: any, navigation: any, fromIndex: any, toIndex: any) {
                if (toIndex === 1) {
                    try {
                        self.validateTab(1);
                    } catch (error) {
                        return false;
                    }
                }
                if (toIndex === 2) {
                    try {
                        self.validateTab(1);
                        self.validateTab(2);
                    } catch (error) {
                        return false;
                    }
                }
                return true;
            },

            onTabShow: function(tab: any, navigation: any, index: any) {
                let $total = navigation.find('li').length;
                let $current = index + 1;

                const $wizard = navigation.closest('.card-wizard');

                if ($current === 2) {
                    $($wizard).find('.approx-time').show();
                } else {
                    $($wizard).find('.approx-time').hide();
                }

                // If it's the last tab then hide the last button and show the finish instead
                if ($current >= $total) {
                    $($wizard).find('.btn-next').hide();
                    $($wizard).find('.btn-finish').show();
                } else {
                    $($wizard).find('.btn-next').show();
                    $($wizard).find('.btn-finish').hide();
                }

                const button_text = navigation.find('li:nth-child(' + $current + ') a').html();

                setTimeout(function(){
                    $('.moving-tab').text(button_text);
                }, 150);

                const checkbox = $('.footer-checkbox');

                if ( index !== 0 ) {
                    $(checkbox).css({
                        'opacity':'0',
                        'visibility':'hidden',
                        'position':'absolute'
                    });
                } else {
                    $(checkbox).css({
                        'opacity':'1',
                        'visibility':'visible'
                    });
                }
                $total = $wizard.find('.nav li').length;
               let  $li_width = 100/$total;

                let total_steps = $wizard.find('.nav li').length;
                let move_distance = $wizard.width() / total_steps;
                let index_temp = index;
                let vertical_level = 0;

                let mobile_device = $(document).width() < 600 && $total > 3;

                if(mobile_device){
                    move_distance = $wizard.width() / 2;
                    index_temp = index % 2;
                    $li_width = 50;
                }

                $wizard.find('.nav li').css('width',$li_width + '%');

                let step_width = move_distance;
                move_distance = move_distance * index_temp;

                $current = index + 1;

                if($current == 1 || (mobile_device == true && (index % 2 == 0) )){
                    move_distance -= 8;
                } else if($current == total_steps || (mobile_device == true && (index % 2 == 1))){
                    move_distance += 8;
                }

                if(mobile_device){
                    let x: any = index / 2;
                    vertical_level = parseInt(x);
                    vertical_level = vertical_level * 38;
                }

                $wizard.find('.moving-tab').css('width', step_width);
                $('.moving-tab').css({
                    'transform':'translate3d(' + move_distance + 'px, ' + vertical_level +  'px, 0)',
                    'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

                });
            }
        });


        // Prepare the preview for profile picture
        $('#wizard-picture').change(function(){
            const input = $(this);

            if (input[0].files && input[0].files[0]) {
                const reader = new FileReader();

                reader.onload = function (e: FileReaderEvent) {
                    $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
                };
                reader.readAsDataURL(input[0].files[0]);
            }
        });

        $('[data-toggle="wizard-radio"]').click(function(){
            const wizard = $(this).closest('.card-wizard');
            wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
            $(this).addClass('active');
            $(wizard).find('[type="radio"]').removeAttr('checked');
            $(this).find('[type="radio"]').attr('checked', 'true');
        });

        $('[data-toggle="wizard-checkbox"]').click(function(){
            if ( $(this).hasClass('active')) {
                $(this).removeClass('active');
                $(this).find('[type="checkbox"]').removeAttr('checked');
            } else {
                $(this).addClass('active');
                $(this).find('[type="checkbox"]').attr('checked', 'true');
            }
        });

        $('.set-full-height').css('height', 'auto');


    }

    ngOnChanges(changes: SimpleChanges) {
        const input = $(this);

        if (input[0].files && input[0].files[0]) {
            const reader: any = new FileReader();

            reader.onload = function (e: FileReaderEvent) {
                $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
            };
            reader.readAsDataURL(input[0].files[0]);
        }
    }
    ngAfterViewInit() {

        // Transition code for Card movement
        $( window ).resize( () => { $('.card-wizard').each(function(){

            const $wizard = $(this);
            const index = $wizard.bootstrapWizard('currentIndex');
            let $total = $wizard.find('.nav li').length;
            let  $li_width = 100/$total;

            let total_steps = $wizard.find('.nav li').length;
            let move_distance = $wizard.width() / total_steps;
            let index_temp = index;
            let vertical_level = 0;

            let mobile_device = $(document).width() < 600 && $total > 3;

            if(mobile_device){
                move_distance = $wizard.width() / 2;
                index_temp = index % 2;
                $li_width = 50;
            }

            $wizard.find('.nav li').css('width',$li_width + '%');

            let step_width = move_distance;
            move_distance = move_distance * index_temp;

            let $current = index + 1;

            if($current == 1 || (mobile_device == true && (index % 2 == 0) )){
                move_distance -= 8;
            } else if($current == total_steps || (mobile_device == true && (index % 2 == 1))){
                move_distance += 8;
            }

            if(mobile_device){
                let x: any = index / 2;
                vertical_level = parseInt(x);
                vertical_level = vertical_level * 38;
            }

            $wizard.find('.moving-tab').css('width', step_width);
            $('.moving-tab').css({
                'transform':'translate3d(' + move_distance + 'px, ' + vertical_level +  'px, 0)',
                'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'
            });

            $('.moving-tab').css({
                'transition': 'transform 0s'
            });
            });
        });
    }

    afterPickerClosed($event) {
        const moment1: moment.Moment = moment($event.selected);
        $('#testExpiryTime').val(moment1.format(this.expiryTimeDisplayFormat));
        this.selectedTime = $event.selected;
    }

    deleteRow(candidateRowIdx) {
        swal({
            title: 'Are you sure?',
            text: '',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: 'Confirm',
            buttonsStyling: false
          }).then((result) => {
            if (result.value) {
                this.tableData.dataRows.splice(candidateRowIdx, 1);
            }
          })
    }

    submitForm() {
      const test = this.createTestObject();
      this._testService.addTest(test).subscribe(
          data => {
            console.log(data);
            this.updateTest(data);
          },
          err => {
            console.log(err);
          }
      );

    }

    submitFormTestInfo() {

        const test = this.createTestObject();
        const questionIds = this.getQuestionIds();
        // const duration = this.getDuration(questionIds);
        const duration = this.approxTime;
        test['duration'] = duration;
        const candidates = this.tableData.dataRows;
        this.validateTestInfo(test, questionIds, candidates);
        this._testService.addTestInfo(test, questionIds, candidates).subscribe(
            data => {
                this.notificationComponent.showNotification('success', 'Test added successfully!');
                this.sharedService.navigateTo('/reports/list')
            }
        );
    }

    getQuestionDetailPagePath(quesId) {
        return 'questions/detail/' + quesId;
    }

    private getDuration(selectedQuestionIds) {
        let duration = 0;
        if (this.questions) {
            for (let quesIdx = 0; quesIdx < this.questions.length; quesIdx++) {
                const question = this.questions[quesIdx];
                if (selectedQuestionIds) {
                    for (let selQuesIdx = 0; selQuesIdx < selectedQuestionIds.length; selQuesIdx++) {
                        const selectedQuestionId = selectedQuestionIds[selQuesIdx];
                        if (question['id'] === parseInt(selectedQuestionId)) {
                            duration += question['approxTime'];
                        }
                    }
                }
            }
        }
        return duration;
    }

    public updateQuestions(data) {
        this.questions = this.questions.concat(data);
        const selectedQuestion = [];
        (this.questions || []).forEach(q => {
            const i = this.selectedQuestion.findIndex(x => x.id === q.id);
            if (i > -1) {
                this.selectedQuestion[i] = q;
                q.selected = true;
            }
        });
    }

    public onScroll() {
        this.getQuestions();
    }

    public selectedTagsChange(value) {
        this.init();
        this.quesTagIds = value;
        this.getQuestions();
    }

    public render(files: FileList) {
        if (files && files.length > 0) {
            const file = files.item(0);
            this._candidateService.readFile(file).subscribe(
                data => {
                    this.updateCandidateTableData(data['response']);
                    $('#candidate-file').val(''); // since the file name might not have changed so removing the existing file
                }
            );
        }
    }

    private getTechnologyTagInfo() {
        this.tagService.getTechnologyTagInfo().subscribe(
            data => {
              this.technologiesFormArray = this.type.get('technologiesFormArray') as FormArray;
              const tags: Tag[] = data['response'][0]['tags'];
              this.technologies = tags;
              for (let i = 0 ; i < tags.length; ++i) {
                  const tag = tags[i];
                  this.technologiesFormArray.push(this.formBuilder.control(tag));
              }
            }
        )
    }

    addQuestion(question) {
        this.selectedQuestion.unshift(question);
        question.selected = true;
        this.approxTime += question.approxTime;
    }

    removeQuestion(question, i) {
        question.selected = false;
        this.selectedQuestion.splice(i, 1);
        this.approxTime -= question.approxTime;
    }

    onDurationChange(days, hrs, minutes) {
        console.log(this.days, this.hrs, this.minutes, this.seconds);
        console.log(days, hrs, minutes, this.seconds);
        this.approxTime = days * 3600 * 24 + hrs * 3600 + minutes * 60 + this.seconds;
    }

    getMinExpiryDate() {
        return new Date();
    }

    duplicateError() {
        this.notificationComponent.showNotification('danger', 'Email id already added!');
    }

    private getAllGroupedRelatedTags() {
        this.tagService.getAllGroupedRelatedTags().subscribe(
            data => {
                const relatedTagInfos: RelatedTagInfo[] = data['response'];
                const groupedTags = [];
                const selectedTechnologies = [];
                for (let idx = 0; idx < relatedTagInfos.length; idx++) {
                    const relatedTagInfo: RelatedTagInfo = relatedTagInfos[idx];
                    const sourceTag = relatedTagInfo.sourceTag;
                    for (let innerIdx = 0; innerIdx < relatedTagInfo.destTags.length; innerIdx++) {
                        const destTag = relatedTagInfo.destTags[innerIdx];
                        destTag['parent'] = sourceTag.tagDto.displayName;
                        groupedTags.push(destTag);
                        selectedTechnologies.push(destTag.tagDto.id);
                    }
                }
                this.groupedTechnologies = groupedTags;
                this.selectedTechnologies = selectedTechnologies;
            }
        );
    }

    private getQuestions() {
        if (this.quesTotalRecords == -1 || this.quesTotalRecords > this.quesOffset) {
            this._questionService.getAllQuestions(this.quesTagIds, this.quesOffset, this.quesLimit).subscribe(
              data => {
                let response = data['response'];
                this.quesTotalRecords = response['totalRecords'];
                let questions = this._questionService.transformQuestions(response['questions']);
                this.updateQuestions(questions);
              }, 
              err => {
                this.updateQuestions([]);
              });
              this.quesOffset += this.quesLimit;
        }
    }

    private createTestObject() {
        const testAttributes = {
            'technologyIds' : this.selectedTechnologies.filter((el, i, a) => i === a.indexOf(el))
        };
        const expiryTime = $('#testExpiryTime').val();
        const test = {
            'name': $('#testName').val(), 
            'description': $('#description').val(), 
            // 'duration': (parseInt($('#testHours').val()) * 60 + parseInt($('#testMinutes').val())) * 60, // in seconds
            'expiry_time': expiryTime,
            'attributes': JSON.stringify(testAttributes) 
        };
        return test;
    }

    private getQuestionIds() {
        // const selectedQuestions = [];
        // $('.test-id:checked').each(function (i) { selectedQuestions.push($(this).val()); });
        // return selectedQuestions;
        return this.selectedQuestion.map(x => x.id);
    }

    private validateTab(index) {
        let errorFields = [];
        let prefix = '';

        if (index === 1) {
            errorFields = this.validateTest(this.createTestObject());
            prefix = 'Please enter the Test ';
        } else if (index === 2) {
            errorFields = this.validateQuestions();
            prefix = 'Please add the Questions!';
        } else {
            errorFields = this.validateCandidates(this.tableData.dataRows);
            prefix = 'Please add the Candidates!';
        }
        if (errorFields && errorFields.length > 0) {
            // self.notificationComponent.showNotification('danger', 'Please enter all the asterisk(*) marked fields!');
            // throw new Error('Please enter the asterisk(*) marked fields!');

            this.notificationComponent.showNotification('danger', prefix + errorFields.join(', '));
            throw new Error(prefix + errorFields.join(', '));
        }
    }

    private validateTestInfo(test: any, questionIds: any, candidates: Candidate[]): any {
        this.validateTest(test);
        this.validateQuestionIds(questionIds);
        this.validateCandidates(candidates);
    }

    private validateTest(test: any): any {
        const errorFields = [];
        this.addToErrorFields(this.validateText(test.name, 'Test Name'), errorFields, 'Name');
        this.addToErrorFields(this.validateText(test.description, 'Test Description'), errorFields, 'Description');
        // this.addToErrorFields(this.validateDuration(test.duration), errorFields, 'Duration');
        this.addToErrorFields(this.validateAndTransformExpiryTime(test), errorFields, 'Expiry Time');
        this.addToErrorFields(this.validateTestAttributes(test), errorFields, 'Technologies');
        return errorFields;
    }

    private validateQuestions(): any {
        const errorFields = [];
        this.addToErrorFields(this.validateQuestionIds(this.getQuestionIds()), errorFields, '');
        return errorFields;
    }

    private validateCandidates(candidates: Candidate[]): any {
        let errorFields = [];
        if (candidates && candidates.length > 0) { 
            for (let index = 0; index < candidates.length; index++) {
                const candidate = candidates[index];
                this.addToErrorFields(this.validateText(candidate.email, 'Candidate Email'), errorFields, 'Email');
                this.addToErrorFields(this.validateText(candidate.name, 'Candidate Name'), errorFields, 'Name');
                if (errorFields.length > 0) {
                    return false;
                }
                // this.validateText(candidate.email, 'Candidate Email');
                // this.validateText(candidate.name, 'Candidate Name');
            }
        } else {
            this.notificationComponent.showNotification('danger', 'Please add the candidates!');
            throw new Error('Candidate emails are empty');
        }
    }

    private addToErrorFields(isValid, errorFields, field) {
        if (!isValid) {
            errorFields.push(field);
        }
    }

    private validateDuration(duration) {
        if (duration) { }
        else {
            return false;
            // this.notificationComponent.showNotification('danger', 'Please enter the test duration!');
            // throw new Error('Test duration can\'t be empty!');
        }
        return true;
    }

    private validateAndTransformExpiryTime(test) {
        let expiryTime =  test.expiry_time;
        if (expiryTime.length === 0) {
            this.notificationComponent.showNotification('danger', 'Please enter the expiry time!');
            throw new Error('Please enter the expiry time!');
        } else {
            let moment1: moment.Moment = moment(expiryTime, this.expiryTimeDisplayFormat, true);
            if (moment1.isValid()) {
                const currentTime = moment();
                if (moment1.isSameOrBefore(currentTime)) {
                    this.notificationComponent.showNotification('danger', 'The expiry time must be greater than the current time!');
                    throw new Error('The expiry time must be greater than the current time!');
                }
                expiryTime = moment1.utc().format('YYYY-MM-DDTHH:mmZ');
            } else {
                this.notificationComponent.showNotification('danger', 'Please enter the expiry time in the correct format!');
                throw new Error('Please enter the expiry time in the correct format!');
            }
        }
        test.expiry_time = expiryTime;
        return true;
    }

    private validateTestAttributes(test: any) {
        let attributes = JSON.parse(test.attributes);
        if (attributes) {
            if (attributes.technologyIds && attributes.technologyIds.length > 0) { }
            else {
                return false;
                // this.notificationComponent.showNotification('danger', 'Please enter the allowed technologies!');
                // throw new Error("Test technologies can't be empty!");
            }
        } else {
            // this.notificationComponent.showNotification('danger', 'Please enter the test attributes!');
            // throw new Error("Test attributes can't be empty!");
            return false;
        }
        return true;
    }

    private validateTestDurationFields(field: any, fieldName: any) {
        if (isNaN(field)) { 
            this.notificationComponent.showNotification('danger', 'Please enter the test duration ' + fieldName + '!');
            throw new Error("Test duration " + fieldName + " can't be empty!");
        }
    }

    private validateText(text: any, field: any) {
        if (text && text.length > 0) { }
        else {
            // this.notificationComponent.showNotification('danger', 'Please enter the ' + field + '!');
            // throw new Error(field + ' is empty!');
            return false;
        }
        return true;
    }

    private validateQuestionIds(questionIds: any) {
        if (questionIds && questionIds.length > 0) { }
        else {
            return false;
            // this.notificationComponent.showNotification('danger', 'Please select the questions!');
            // throw new Error('Question ids are empty');
        }
        return true;
    }
}
