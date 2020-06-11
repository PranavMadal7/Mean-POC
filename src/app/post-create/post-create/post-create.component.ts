import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Post } from '../post.model';
import { PostService } from '../post.service';
import { mimeType } from '../validators/mime-type.validator'

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  private mode = 'create';
  private postId: string;
  post: Post;
  loading: boolean = true;
  imagePreview: string;

  constructor(private postService: PostService, public route: ActivatedRoute, public router: Router) { }
  postForm: FormGroup;

  ngOnInit(): void {
    this.loading = true;

    this.postForm = new FormGroup({
      title: new FormControl('', { validators: [Validators.required] }),
      content: new FormControl('', { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    });

    this.route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        this.loading = false;
        if (paramMap.has('postId')) {
          this.mode = 'edit'
          this.postId = paramMap.get('postId');
          this.postService.getPost(this.postId).subscribe(postData => {
            this.loading = false;
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
              imagePath: postData.imagePath
            };
            this.postForm.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath
            });
          });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({ image: file });
    this.postForm.get('image').updateValueAndValidity();
    console.log(this.postForm.get('image').valid);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost = () => {
    if (this.postForm.invalid) {
      return;
    }
    this.loading = true;
    if (this.mode === 'create') {
      this.postService.addPost(
        this.postForm.value.title,
        this.postForm.value.content,
        this.postForm.value.image
      );
    } else {
      this.postService.updatePost(
        this.postId,
        this.postForm.value.title,
        this.postForm.value.content,
        this.postForm.value.image
      );
    }
    this.postForm.reset();
    this.router.navigate(['/'], { relativeTo: this.route });
  };

}
