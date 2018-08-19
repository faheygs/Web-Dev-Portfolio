// 3rd party packages from NPM
import $ from 'jquery';
import slick from 'slick-carousel';

// Our modules / classes
import Like from './modules/Like';
import MyNotes from './modules/MyNotes';
import Search from './modules/Search';
import GoogleMap from './modules/GoogleMap';
import MobileMenu from './modules/MobileMenu';
import HeroSlider from './modules/HeroSlider';

// Instantiate a new object using our modules/classes
var mobileMenu = new MobileMenu();
var heroSlider = new HeroSlider();
var googleMap = new GoogleMap();
var search = new Search();
var mynotes = new MyNotes();
var like = new Like();