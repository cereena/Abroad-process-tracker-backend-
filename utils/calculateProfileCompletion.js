export function calculateProfileCompletion(student) {
  let completed = 0;
  const total = 5;

  if (
    student.personalInfo?.firstName &&
    student.personalInfo?.lastName &&
    student.personalInfo?.gender &&
    student.personalInfo?.dob
  ) completed++;

  if (student.academicInfo?.highestQualification)
    completed++;

  if (student.workExperience?.hasExperience !== null)
    completed++;

  if (student.preferences?.countries?.length)
    completed++;

  if (student.sponsorship?.type)
    completed++;

  return Math.round((completed / total) * 100);
}
