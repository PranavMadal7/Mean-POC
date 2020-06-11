import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map, share } from 'rxjs/operators';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{ posts: Post[], postCount: number }>();

  constructor(private http: HttpClient) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParam = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, posts: any, maxPosts: any }>('http://localhost:3000/api/posts' + queryParam)
      .pipe(
        map((postData) => {
          return {
            post: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.post;
        this.postUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      }, err => {
        console.error(err);
      });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string; title: string; content: string, imagePath: string }>('http://localhost:3000/api/posts/' + id);
  }

  addPost = (title: string, content: string, image: File) => {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe((responseData) => {
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: FormData | Post;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        imagePath: image,
        content: content
      }
    }
    return this.http.put('http://localhost:3000/api/posts/' + id, postData).subscribe(
      response => {
      }
    )
  }

  deletePost = (id: string) => {
    return this.http.delete('http://localhost:3000/api/posts/' + id);
  }
}
