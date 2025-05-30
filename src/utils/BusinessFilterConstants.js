/*

This utils file will contain search and filter options available for the business to choose from

*/

//part time, casual
export const AVAILABILITY_OPTIONS = [
   { value: 'any', label: 'Any Availability' },
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'casual', label: 'Casual' },
    { value: 'flexible', label: 'Flexible' },
];

export const EDUCATION_LEVEL_OPTIONS = [
    { value: 'any', label: 'Any Education Level' }, 
    { value: 'Certificate', label: 'Certificate III in Early Childhood Education' },
    { value: 'Diploma', label: 'Diploma of Early Childhood Education' },
    { value: 'Bachelor', label: 'Bachelor of Early Childhood Education' },
    { value: 'Masters', label: 'Masters or Higher' },
    { value: 'Other', label: 'Other Qualification' },
];

export const LOCATION_OPTIONS = [
   // { value: 'any', label: 'Any Location' },
   // { value: 'Sydney, NSW', label: 'Sydney, NSW' },
   // { value: 'Melbourne, VIC', label: 'Melbourne, VIC' },
   // { value: 'Brisbane, QLD', label: 'Brisbane, QLD' },
   // { value: 'Perth, WA', label: 'Perth, WA' },
   // { value: 'Adelaide, SA', label: 'Adelaide, SA' },
];

//Educator, room leader
export const PREFERRED_ROLE_OPTIONS = [
    { value: 'any', label: 'Any Preferred Role' },
    { value: 'educator', label: 'Educator' },
    { value: 'room-leader', label: 'Room Leader' },
    { value: 'assistant', label: 'Educational Assistant' },
    { value: 'director', label: 'Director' },
    { value: 'other', label: 'Other' },
];

export const SHIFT_PREFERENCE_OPTIONS = [
    { value: 'any', label: 'Any Shift' },
    { value: 'morning', label: 'Morning Shift' },
    { value: 'afternoon', label: 'Afternoon Shift' },
    { value: 'evening', label: 'Evening Shift' },
    { value: 'overnight', label: 'Overnight Shift' },
];
