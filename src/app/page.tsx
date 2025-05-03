import TaskInput from '@/components/TaskInput';
import TaskList from '@/components/TaskList';
import TaskFilter from '@/components/TaskFilter';
import ThemeToggle from '@/components/ThemeToggle';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12 max-w-2xl relative">
      <ThemeToggle />
       <Card className="w-full shadow-lg">
         <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-6">TaskMaster</CardTitle>
         </CardHeader>
         <CardContent>
             <TaskInput />
             <TaskFilter />
             <TaskList />
         </CardContent>
       </Card>
    </main>
  );
}
