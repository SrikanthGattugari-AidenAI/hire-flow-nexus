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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Brain, 
  Plus, 
  Settings, 
  Users as UsersIcon, 
  BarChart3, 
  MessageSquare, 
  FileText,
  Trash2,
  PenLine,
  MoveHorizontal,
  Bot
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { candidates as initialCandidates, jobs, applicationStages, users } from "@/data/mockData";
import { useIsMobile } from "@/hooks/use-mobile";

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
  aiScore?: number;
  fitPercentage?: number;
  resume?: {
    url: string;
    summary: string;
    experience: {
      company: string;
      position: string;
      duration: string;
      description: string;
    }[];
    education: {
      institution: string;
      degree: string;
      year: string;
    }[];
    skills: string[];
  };
  notes?: {
    user: any;
    date: string;
    content: string;
  }[];
  interviews?: {
    id: number;
    date: string;
    time: string;
    type: string;
    interviewers: any[];
  }[];
}

interface Column {
  id: number;
  title: string;
  color: string;
  candidateIds: number[];
}

const candidates: Candidate[] = initialCandidates.map(c => ({ ...c }));

const Workflow = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [jobFilter, setJobFilter] = useState<string>("all");
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const [newStageColor, setNewStageColor] = useState("bg-blue-500");
  const [editStageId, setEditStageId] = useState<number | null>(null);
  const [showAIFeatures, setShowAIFeatures] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const initialColumns = applicationStages.map((stage) => ({
    id: stage.id,
    title: stage.name,
    color: stage.color,
    candidateIds: candidates
      .filter((c) => c.status.id === stage.id)
      .map((c) => c.id),
  }));

  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const filteredCandidateIds = jobFilter === "all"
    ? candidates.map((c) => c.id)
    : candidates
        .filter((c) => c.jobId.toString() === jobFilter)
        .map((c) => c.id);

  const filteredColumns = columns.map((column) => ({
    ...column,
    candidateIds: column.candidateIds.filter((id) =>
      filteredCandidateIds.includes(id)
    ),
  }));

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (result.type === "column") {
      const newColumnOrder = Array.from(columns);
      const movedColumn = newColumnOrder.splice(source.index, 1)[0];
      newColumnOrder.splice(destination.index, 0, movedColumn);
      
      setColumns(newColumnOrder);
      toast({
        title: "Pipeline updated",
        description: "The workflow stages have been reordered.",
      });
      return;
    }

    const sourceCol = columns.find((col) => col.id.toString() === source.droppableId);
    const destCol = columns.find((col) => col.id.toString() === destination.droppableId);

    if (!sourceCol || !destCol) return;

    const candidateId = parseInt(draggableId);
    
    const newColumns = columns.map((col) => {
      if (col.id === sourceCol.id) {
        return {
          ...col,
          candidateIds: col.candidateIds.filter((id) => id !== candidateId),
        };
      }
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
    
    const candidate = candidates.find((c) => c.id === candidateId);
    const stage = applicationStages.find((s) => s.id === destCol.id);
    
    if (candidate && stage) {
      candidate.status = stage;
      
      toast({
        title: `Candidate moved to ${stage.name}`,
        description: `${candidate.name} is now in the ${stage.name} stage.`,
      });

      if (stage.name === "Interview") {
        setTimeout(() => {
          toast({
            title: "AI Recommendation",
            description: `Based on ${candidate.name}'s resume, we suggest focusing on their project management experience.`,
          });
        }, 1000);
      }
    }
  };

  const addNewStage = () => {
    if (!newStageName.trim()) {
      toast({
        title: "Error",
        description: "Stage name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...columns.map(col => col.id)) + 1;
    const newColumn: Column = {
      id: newId,
      title: newStageName,
      color: newStageColor,
      candidateIds: [],
    };

    setColumns([...columns, newColumn]);
    setNewStageName("");
    setNewStageColor("bg-blue-500");

    toast({
      title: "Stage Added",
      description: `"${newStageName}" has been added to your workflow.`,
    });
  };

  const updateStage = () => {
    if (!newStageName.trim() || editStageId === null) {
      toast({
        title: "Error",
        description: "Stage name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const updatedColumns = columns.map(col => 
      col.id === editStageId 
        ? { ...col, title: newStageName, color: newStageColor } 
        : col
    );

    setColumns(updatedColumns);
    setNewStageName("");
    setNewStageColor("bg-blue-500");
    setEditStageId(null);

    toast({
      title: "Stage Updated",
      description: `Stage has been updated to "${newStageName}".`,
    });
  };

  const deleteStage = (id: number) => {
    if (columns.length <= 1) {
      toast({
        title: "Cannot Delete",
        description: "You must keep at least one stage in the workflow.",
        variant: "destructive",
      });
      return;
    }

    const stageToDelete = columns.find(col => col.id === id);
    if (stageToDelete && stageToDelete.candidateIds.length > 0) {
      toast({
        title: "Cannot Delete",
        description: "This stage contains candidates. Move them before deleting.",
        variant: "destructive",
      });
      return;
    }

    const updatedColumns = columns.filter(col => col.id !== id);
    setColumns(updatedColumns);

    toast({
      title: "Stage Deleted",
      description: "The stage has been removed from your workflow.",
    });
  };

  const handleEditStage = (id: number, title: string, color: string) => {
    setEditStageId(id);
    setNewStageName(title);
    setNewStageColor(color);
  };

  const showCandidateDetails = (candidateId: number) => {
    const candidate = candidates.find((c) => c.id === candidateId) as Candidate;
    if (candidate) {
      if (showAIFeatures) {
        candidate.aiScore = Math.floor(Math.random() * 30) + 70;
        candidate.fitPercentage = Math.floor(Math.random() * 40) + 60;
      }
      setSelectedCandidate(candidate);
      setIsDrawerOpen(true);
    }
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workflow</h1>
        <div className="flex items-center space-x-2">
          <Select onValueChange={setJobFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {jobs.map((job) => (
                <SelectItem key={job.id} value={job.id.toString()}>
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Customize
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Customize Workflow</DialogTitle>
                <DialogDescription>
                  Add, edit, or delete stages to customize your workflow.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Stage Name
                  </Label>
                  <Input
                    id="name"
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="color" className="text-right">
                    Stage Color
                  </Label>
                  <Select value={newStageColor} onValueChange={setNewStageColor}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bg-blue-500">Blue</SelectItem>
                      <SelectItem value="bg-green-500">Green</SelectItem>
                      <SelectItem value="bg-yellow-500">Yellow</SelectItem>
                      <SelectItem value="bg-red-500">Red</SelectItem>
                      <SelectItem value="bg-purple-500">Purple</SelectItem>
                      <SelectItem value="bg-orange-500">Orange</SelectItem>
                      <SelectItem value="bg-pink-500">Pink</SelectItem>
                      <SelectItem value="bg-gray-500">Gray</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                {editStageId === null ? (
                  <Button type="submit" onClick={addNewStage}>
                    Add Stage
                  </Button>
                ) : (
                  <Button type="submit" onClick={updateStage}>
                    Update Stage
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={() => setShowAIFeatures(!showAIFeatures)}>
            {showAIFeatures ? "Hide AI Features" : "Show AI Features"}
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="mt-4 flex space-x-4 overflow-x-auto">
          <Droppable droppableId="column-order" type="column" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex space-x-4"
              >
                {filteredColumns.map((column, index) => (
                  <Draggable key={column.id} draggableId={column.id.toString()} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="w-80 flex-shrink-0"
                      >
                        <CardHeader
                          {...provided.dragHandleProps}
                          className="cursor-move flex items-center justify-between"
                        >
                          <CardTitle className="capitalize">{column.title}</CardTitle>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleEditStage(column.id, column.title, column.color)
                              }
                            >
                              <PenLine className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteStage(column.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardDescription className="px-6">
                          <Badge className={column.color}>{column.candidateIds.length} Candidates</Badge>
                        </CardDescription>
                        <CardContent>
                          <Droppable droppableId={column.id.toString()} type="candidate">
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="min-h-[50px]"
                              >
                                {column.candidateIds.map((candidateId, index) => {
                                  const candidate = candidates.find((c) => c.id === candidateId);
                                  return candidate ? (
                                    <Draggable
                                      key={candidate.id}
                                      draggableId={candidate.id.toString()}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className="mb-2 rounded-md border p-4 shadow-sm hover:bg-secondary/50 cursor-move"
                                          onClick={() => showCandidateDetails(candidate.id)}
                                        >
                                          <div className="flex items-center space-x-4">
                                            <Avatar>
                                              <AvatarImage src={candidate.photo} alt={candidate.name} />
                                              <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                              <p className="text-sm font-medium">{candidate.name}</p>
                                              <p className="text-xs text-muted-foreground">{candidate.email}</p>
                                            </div>
                                          </div>
                                          {showAIFeatures && candidate.aiScore && candidate.fitPercentage && (
                                            <div className="mt-2 text-xs">
                                              <p>AI Score: {candidate.aiScore}</p>
                                              <p>Fit: {candidate.fitPercentage}%</p>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </Draggable>
                                  ) : null;
                                })}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className={isMobile ? "h-screen" : "h-[90vh]"}>
          <DrawerHeader>
            <DrawerTitle>{selectedCandidate?.name}</DrawerTitle>
            <DrawerDescription>
              {selectedCandidate?.email} | {selectedCandidate?.phone}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 py-2">
            <h3 className="text-lg font-semibold mb-2">Candidate Details</h3>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar>
                <AvatarImage src={selectedCandidate?.photo} alt={selectedCandidate?.name || "Candidate"} />
                <AvatarFallback>{selectedCandidate?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{selectedCandidate?.name}</p>
                <p className="text-xs text-muted-foreground">{selectedCandidate?.location}</p>
              </div>
            </div>

            {selectedCandidate?.resume && (
              <>
                <h4 className="text-md font-semibold mt-4 mb-2">Resume Summary</h4>
                <p className="text-sm mb-4">{selectedCandidate?.resume?.summary}</p>

                <h4 className="text-md font-semibold mt-4 mb-2">Experience</h4>
                {selectedCandidate?.resume?.experience.map((exp, index) => (
                  <div key={index} className="mb-4">
                    <p className="font-medium">{exp.position} at {exp.company}</p>
                    <p className="text-xs text-muted-foreground">{exp.duration}</p>
                    <p className="text-sm">{exp.description}</p>
                  </div>
                ))}

                <h4 className="text-md font-semibold mt-4 mb-2">Education</h4>
                {selectedCandidate?.resume?.education.map((edu, index) => (
                  <div key={index} className="mb-4">
                    <p className="font-medium">{edu.degree} in {edu.institution}</p>
                    <p className="text-xs text-muted-foreground">{edu.year}</p>
                  </div>
                ))}

                <h4 className="text-md font-semibold mt-4 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate?.resume?.skills.map((skill, index) => (
                    <Badge key={index}>{skill}</Badge>
                  ))}
                </div>
              </>
            )}

            {selectedCandidate?.notes && selectedCandidate.notes.length > 0 && (
              <>
                <h4 className="text-md font-semibold mt-4 mb-2">Notes</h4>
                {selectedCandidate.notes.map((note, index) => (
                  <div key={index} className="mb-4 border rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">{note.user.name}</p>
                      <p className="text-xs text-muted-foreground">{note.date}</p>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </div>
                ))}
              </>
            )}

            {selectedCandidate?.interviews && selectedCandidate.interviews.length > 0 && (
              <>
                <h4 className="text-md font-semibold mt-4 mb-2">Interviews</h4>
                {selectedCandidate.interviews.map((interview, index) => (
                  <div key={index} className="mb-4 border rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Interview {interview.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {interview.date} at {interview.time}
                      </p>
                    </div>
                    <p className="text-sm">
                      Interviewers: {interview.interviewers.map((interviewer: any) => interviewer.name).join(", ")}
                    </p>
                  </div>
                ))}
              </>
            )}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Workflow;
