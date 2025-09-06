# clean-web
goal is to block problematic images from rendering in html pages (mostly as chrome extension but the infrastructure is generic)
- hides all images elems (img or any other with bg image or even videos) by default
- fetches their underlying image
- classify it's level of nudity (women receives automitaclly higher nudity level, then the more part of the body are there the higher the level etc). also whther the intention of the figure is sexual it receives hight level etc.
- block / allow accordingly
