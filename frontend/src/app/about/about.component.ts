/*
 * Copyright (c) 2014-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import { Component, type OnInit } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { ConfigurationService } from '../Services/configuration.service'
import { FeedbackService } from '../Services/feedback.service'
import { Gallery, type GalleryRef } from 'ng-gallery'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFacebook, faReddit, faSlack, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faNewspaper, faStar } from '@fortawesome/free-regular-svg-icons'
import { faStar as fasStar, faPalette } from '@fortawesome/free-solid-svg-icons'
import { catchError } from 'rxjs/operators'
import { EMPTY } from 'rxjs'

library.add(faFacebook, faTwitter, faSlack, faReddit, faNewspaper, faStar, fasStar, faPalette)

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  public twitterUrl?: string
  public facebookUrl?: string
  public slackUrl?: string
  public redditUrl?: string
  public pressKitUrl?: string
  public nftUrl?: string
  public galleryRef: GalleryRef

  private readonly images = [
    'assets/public/images/carousel/1.jpg',
    'assets/public/images/carousel/2.jpg',
    'assets/public/images/carousel/3.jpg',
    'assets/public/images/carousel/4.jpg',
    'assets/public/images/carousel/5.png',
    'assets/public/images/carousel/6.jpg',
    'assets/public/images/carousel/7.jpg'
  ]

  private readonly stars = [
    null,
    '<i class="fas fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>',
    '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>',
    '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i>',
    '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i>',
    '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>'
  ]

  constructor (
    private readonly configurationService: ConfigurationService,
    private readonly feedbackService: FeedbackService,
    private readonly sanitizer: DomSanitizer,
    private readonly gallery: Gallery
  ) {}

  ngOnInit () {
    this.galleryRef = this.gallery.ref('feedback-gallery')
    this.populateSlideshowFromFeedbacks()
    this.configurationService.getApplicationConfiguration()
      .pipe(
        catchError((err) => {
          console.error(err)
          return EMPTY
        })
      ).subscribe((config) => {
        if (config?.application?.social) {
          if (config.application.social.twitterUrl) {
            this.twitterUrl = config.application.social.twitterUrl
          }
          if (config.application.social.facebookUrl) {
            this.facebookUrl = config.application.social.facebookUrl
          }
          if (config.application.social.slackUrl) {
            this.slackUrl = config.application.social.slackUrl
          }
          if (config.application.social.redditUrl) {
            this.redditUrl = config.application.social.redditUrl
          }
          if (config.application.social.pressKitUrl) {
            this.pressKitUrl = config.application.social.pressKitUrl
          }
          if (config.application.social.nftUrl) {
            this.nftUrl = config.application.social.nftUrl
          }
        }
      })
  }

  populateSlideshowFromFeedbacks () {
    this.feedbackService
      .find()
      .pipe(
        catchError((err) => {
          console.error(err)
          return EMPTY
        })
      )
      .subscribe((feedbacks) => {
        for (let i = 0; i < feedbacks.length; i++) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          feedbacks[i].comment = `<span style="width: 90%; display:block;">${
            feedbacks[i].comment
          }<br/> (${this.stars[feedbacks[i].rating]})</span>`
          feedbacks[i].comment = this.sanitizer.bypassSecurityTrustHtml(
            feedbacks[i].comment
          )

          this.galleryRef.addImage({
            src: this.images[i % this.images.length],
            args: feedbacks[i].comment
          })
        }
      })
  }
}
