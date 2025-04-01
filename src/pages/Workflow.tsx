import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Users as UsersIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { candidates, jobs, applicationStages, users } from "@/data/mockData";

// Type definitions
interface Stage {
  id: number;
  name: string;
  color: string;
}

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  photo: string;
  jobId: number;
  appliedDate: string;
  status: Stage;
  tags: string[];
}

interface Column {
  id: number;
  title: string;
  color: string;
  candidateIds: number[];
}

const Workflow = () => {
  const { toast } = useToast();

  // Filter state
  const [jobFilter, setJobFilter] = useState<string>("all"); // Changed default to "all" instead of empty string
  
  // Initialize columns from application stages
  const initialColumns = applicationStages.map((stage) => ({
    id: stage.id,
    title: stage.name,
    color: stage.color,
    candidateIds: candidates
      .filter((c) => c.status.id === stage.id)
      .map((c) => c.id),
  }));
  
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  
  // Get filtered candidates based on jobFilter
  const filteredCandidateIds = jobFilter === "all"
    ? candidates.map((c) => c.id)
    : candidates
        .filter((c) => c.jobId.toString() === jobFilter)
        .map((c) => c.id);

  // Filter columns to only show candidates that match the jobFilter
  const filteredColumns = columns.map((column) => ({
    ...column,
    candidateIds: column.candidateIds.filter((id) =>
      filteredCandidateIds.includes(id)
    ),
  }));

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // If dropped outside of a droppable area
    if (!destination) return;

    // If dropped in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Find source and destination columns
    const sourceCol = columns.find((col) => col.id.toString() === source.droppableId);
    const destCol = columns.find((col) => col.id.toString() === destination.droppableId);

    if (!sourceCol || !destCol) return;

    const candidateId = parseInt(draggableId);
    
    // Update columns
    const newColumns = columns.map((col) => {
      // Remove from source column
      if (col.id === sourceCol.id) {
        return {
          ...col,
          candidateIds: col.candidateIds.filter((id) => id !== candidateId),
        };
      }
      // Add to destination column
      if (col.id === destCol.id) {
        const newCandidateIds = Array.from(col.candidateIds);
        newCandidateIds.splice(destination.index, 0, candidateId);
        return {
          ...col,
          candidateIds: newCandidateIds,
        };
      }
      return col;
    });
    
    setColumns(newColumns);
    
    // Update candidate status in mock data
    const candidate = candidates.find((c) => c.id === candidateId);
    const stage = applicationStages.find((s) => s.id === destCol.id);
    
    if (candidate && stage) {
      candidate.status = stage;
      
      toast({
        title: `Candidate moved to ${stage.name}`,
        description: `${candidate.name} is now in the ${stage.name} stage.`,
      });
    }
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Application Pipeline</h1>
        
        <div className="flex gap-2">
          <Select value={jobFilter} onValueChange={setJobFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem> {/* Changed value from empty string to "all" */}
              {jobs.map((job) => (
                <SelectItem key={job.id} value={job.id.toString()}>
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Stage
          </Button>
        </div>
      </div>
      
      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="inline-flex gap-4" style={{ minWidth: '100%' }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            {filteredColumns.map((column) => (
              <div key={column.id} className="w-80 flex-shrink-0">
                <Card className="h-full flex flex-col">
                  <CardHeader className={`${column.color} text-white rounded-t-lg`}>
                    <div className="flex items-center justify-between">
                      <CardTitle>{column.title}</CardTitle>
                      <Badge variant="secondary" className="bg-white text-gray-800">
                        {column.candidateIds.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <Droppable droppableId={column.id.toString()}>
                    {(provided, snapshot) => (
                      <CardContent
                        className={`flex-1 overflow-y-auto p-3 ${
                          snapshot.isDraggingOver ? "bg-gray-50" : ""
                        }`}
                        style={{ minHeight: '400px', maxHeight: '70vh' }}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {column.candidateIds.map((candidateId, index) => {
                          const candidate = candidates.find((c) => c.id === candidateId);
                          if (!candidate) return null;

                          const job = jobs.find((j) => j.id === candidate.jobId);
                          
                          return (
                            <Draggable
                              key={candidate.id}
                              draggableId={candidate.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`mb-3 p-3 bg-white rounded-md border ${
                                    snapshot.isDragging ? "shadow-lg" : "shadow-sm"
                                  }`}
                                >
                                  <div className="flex items-center gap-3 mb-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage
                                        src={candidate.photo}
                                        alt={candidate.name}
                                      />
                                      <AvatarFallback>
                                        {candidate.name.substring(0, 2)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="truncate">
                                      <p className="font-medium text-sm truncate">
                                        {candidate.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground truncate">
                                        {job?.title || "Unknown Position"}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {candidate.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {candidate.tags.slice(0, 2).map((tag) => (
                                        <Badge
                                          key={tag}
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {tag}
                                        </Badge>
                                      ))}
                                      {candidate.tags.length > 2 && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          +{candidate.tags.length - 2} more
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                                    <span>Applied: {candidate.appliedDate}</span>
                                    {column.id >= 2 && column.id <= 5 && (
                                      <div className="flex -space-x-2">
                                        {users.slice(0, 2).map((user) => (
                                          <Avatar
                                            key={user.id}
                                            className="h-5 w-5 border border-white"
                                          >
                                            <AvatarImage
                                              src={user.avatar}
                                              alt={user.name}
                                            />
                                            <AvatarFallback>
                                              {user.name.substring(0, 2)}
                                            </AvatarFallback>
                                          </Avatar>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                        
                        {column.candidateIds.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-md">
                            No candidates in this stage
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Droppable>
                  
                  <CardFooter className="p-3 border-t">
                    <Button variant="ghost" size="sm" className="w-full">
                      <UsersIcon className="mr-2 h-4 w-4" />
                      Assign Team
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default Workflow;
