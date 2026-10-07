if (!customElements.get('flexible-hero-banner')) {
  class FlexibleHeroBanner extends HTMLElement {
    connectedCallback() {
      if (this.initialized) return;

      this.video = this.querySelector('[data-flexible-hero-video]');
      if (!this.video) return;

      this.initialized = true;
      this.isVisible = false;
      this.sourcesLoaded = false;
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.desktopViewport = window.matchMedia('(min-width: 750px)');
      this.handlePreferenceChange = this.updatePlayback.bind(this);
      this.handleCanPlay = this.markVideoReady.bind(this);
      this.handleIntersection = this.handleIntersection.bind(this);

      this.reducedMotion.addEventListener('change', this.handlePreferenceChange);
      this.desktopViewport.addEventListener('change', this.handlePreferenceChange);
      this.video.addEventListener('canplay', this.handleCanPlay);

      this.observer = new IntersectionObserver(this.handleIntersection, {
        rootMargin: '200px 0px',
        threshold: 0.01,
      });
      this.observer.observe(this);
    }

    disconnectedCallback() {
      if (!this.initialized) return;

      this.observer?.disconnect();
      this.video?.pause();
      this.video?.removeEventListener('canplay', this.handleCanPlay);
      this.reducedMotion?.removeEventListener('change', this.handlePreferenceChange);
      this.desktopViewport?.removeEventListener('change', this.handlePreferenceChange);
      this.initialized = false;
    }

    handleIntersection(entries) {
      this.isVisible = entries.some((entry) => entry.isIntersecting);
      this.updatePlayback();
    }

    shouldUseVideo() {
      if (this.reducedMotion.matches) return false;
      return this.desktopViewport.matches || this.dataset.mobileVideo === 'play';
    }

    loadSources() {
      if (this.sourcesLoaded) return;

      this.video.querySelectorAll('source[data-src]').forEach((source) => {
        source.src = source.dataset.src;
        source.removeAttribute('data-src');
      });
      this.video.load();
      this.sourcesLoaded = true;
    }

    updatePlayback() {
      if (!this.shouldUseVideo()) {
        this.video.pause();
        this.classList.remove('is-video-ready');
        return;
      }

      if (!this.isVisible) {
        this.video.pause();
        return;
      }

      this.loadSources();
      const playPromise = this.video.play();
      if (playPromise !== undefined) playPromise.catch(() => {});
    }

    markVideoReady() {
      this.classList.add('is-video-ready');
    }
  }

  customElements.define('flexible-hero-banner', FlexibleHeroBanner);
}
