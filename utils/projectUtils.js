export function calculateProgress(tasks) {
  if (!tasks || tasks.length === 0) return 0;

  const completedTasks = tasks.filter((task) => task.completed).length;
  return Math.round((completedTasks / tasks.length) * 100);
}

export function getProjectStatus(progress) {
  if (progress === 100) return "completed";
  if (progress > 0) return "in_progress";
  return "pending";
}
