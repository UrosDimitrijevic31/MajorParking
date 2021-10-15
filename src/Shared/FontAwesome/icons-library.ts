import { library } from "@fortawesome/fontawesome-svg-core";
// * NOTE must be extracted this way because of the font awesomes tree-shacking problems
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import { faParking } from "@fortawesome/free-solid-svg-icons/faParking";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons/faCalendarDay";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

library.add(
    faBars,
    faParking,
    faSearch,
    faCheck,
    faChevronLeft,
    faUsers,
    faTimes,
    faCalendarDay
);
