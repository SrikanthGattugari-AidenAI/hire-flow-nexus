
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
import { candidates, jobs, applicationStages, users } from "@/data/mockData";
import { useMobile } from "@/hooks/use-mobile";

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
  aiScore?: number;
  fitPercentage?: number;
}

interface Column {
  id: number;
  title: string;
  color: string;
  candidateIds: number[];
}

const Workflow = () => {
  const { toast } = useToast();
  const isMobile = useMobile();

  // Filter state
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const [newStageColor, setNewStageColor] = useState("bg-blue-500");
  const [editStageId, setEditStageId] = useState<number | null>(null);
  const [showAIFeatures, setShowAIFeatures] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  
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

    // Check if we're dragging columns
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

      // Show AI recommendation toast when moving to Interview stage
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
    // Check if this is the only stage
    if (columns.length <= 1) {
      toast({
        title: "Cannot Delete",
        description: "You must keep at least one stage in the workflow.",
        variant: "destructive",
      });
      return;
    }

    // Check if there are candidates in this stage
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
    const candidate = candidates.find((c) => c.id === candidateId);
    if (candidate) {
      // Add AI score and fit percentage if AI features are enabled
      if (showAIFeatures) {
        candidate.aiScore = Math.floor(Math.random() * 30) + 70; // Score between 70-100
        candidate.fitPercentage = Math.floor(Math.random() * 40) + 60; // Fit between 60-100%
      }
      setSelectedCandidate(candidate);
      setIsDrawerOpen(true);
    }
  };

  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Application Pipeline</h1>
          <p className="text-muted-foreground">Manage and track candidate applications</p>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="w-full md:w-auto">
            <Select value={jobFilter} onValueChange={setJobFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by job" />
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
          </div>
          
          <Dialog open={isCustomizeOpen} onOpenChange={setIsCustomizeOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Customize Workflow
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Customize Application Pipeline</DialogTitle>
                <DialogDescription>
                  Add, edit, or remove stages in your recruitment workflow.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Current Stages</h3>
                  <div className="space-y-2">
                    {columns.map((column) => (
                      <div key={column.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${column.color}`}></div>
                          <span>{column.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditStage(column.id, column.title, column.color)}
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
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    {editStageId !== null ? "Edit Stage" : "Add New Stage"}
                  </h3>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="stage-name">Stage Name</Label>
                      <Input 
                        id="stage-name" 
                        placeholder="e.g. Initial Screening" 
                        value={newStageName}
                        onChange={(e) => setNewStageName(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label>Stage Color</Label>
                      <div className="flex flex-wrap gap-2">
                        {["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500", "bg-orange-500", "bg-red-500", "bg-indigo-500"].map((color) => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-full ${color} ${newStageColor === color ? "ring-2 ring-black ring-offset-2" : ""}`}
                            onClick={() => setNewStageColor(color)}
                            type="button"
                          />
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={editStageId !== null ? updateStage : addNewStage}
                    >
                      {editStageId !== null ? "Update Stage" : "Add Stage"}
                    </Button>
                    
                    {editStageId !== null && (
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => {
                          setEditStageId(null);
                          setNewStageName("");
                          setNewStageColor("bg-blue-500");
                        }}
                      >
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setIsCustomizeOpen(false)}>Done</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant={showAIFeatures ? "default" : "outline"}
            onClick={() => {
              setShowAIFeatures(!showAIFeatures);
              toast({
                title: `AI Features ${showAIFeatures ? "Disabled" : "Enabled"}`,
                description: showAIFeatures ? 
                  "AI assistant features have been turned off." : 
                  "AI will now provide recommendations and insights.",
              });
            }}
          >
            <Brain className="mr-2 h-4 w-4" />
            {showAIFeatures ? "AI Enabled" : "Enable AI"}
          </Button>
        </div>
      </div>
      
      {showAIFeatures && (
        <Card className="mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-blue-200">
          <CardContent className="pt-6 pb-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <Brain className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-800 mb-1">AI Assistant Enabled</h3>
                <p className="text-sm text-blue-600 mb-3">
                  AI features are now active to help with candidate evaluation and workflow optimization.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-white border-blue-300 text-blue-700 hover:bg-blue-50">
                    <FileText className="h-3 w-3 mr-1" /> Resume Parsing
                  </Badge>
                  <Badge variant="outline" className="bg-white border-blue-300 text-blue-700 hover:bg-blue-50">
                    <BarChart3 className="h-3 w-3 mr-1" /> Predictive Analytics
                  </Badge>
                  <Badge variant="outline" className="bg-white border-blue-300 text-blue-700 hover:bg-blue-50">
                    <Bot className="h-3 w-3 mr-1" /> Candidate Chatbot
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="inline-flex gap-4" style={{ minWidth: '100%' }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="all-columns" direction="horizontal" type="column">
              {(provided) => (
                <div 
                  className="inline-flex gap-4"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {filteredColumns.map((column, index) => (
                    <Draggable
                      key={column.id}
                      draggableId={`column-${column.id}`}
                      index={index}
                      isDragDisabled={isCustomizeOpen}
                    >
                      {(provided) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="w-80 flex-shrink-0"
                        >
                          <Card className="h-full flex flex-col">
                            <CardHeader 
                              className={`${column.color} text-white rounded-t-lg`}
                              {...provided.dragHandleProps}
                            >
                              <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center">
                                  <MoveHorizontal className="h-4 w-4 mr-2 opacity-70" />
                                  {column.title}
                                </CardTitle>
                                <Badge variant="secondary" className="bg-white text-gray-800">
                                  {column.candidateIds.length}
                                </Badge>
                              </div>
                            </CardHeader>
                            
                            <Droppable droppableId={column.id.toString()}>
                              {(provided, snapshot) => (
                                <CardContent
                                  className={`flex-1 overflow-y-auto p-3 transition-colors duration-200 ${
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
                                            className={`mb-3 p-3 bg-white rounded-md border transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-pointer ${
                                              snapshot.isDragging ? "shadow-lg" : "shadow-sm"
                                            }`}
                                            onClick={() => showCandidateDetails(candidate.id)}
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
                                            
                                            {showAIFeatures && (
                                              <div className="mb-2 pt-1 border-t">
                                                <div className="flex items-center justify-between">
                                                  <span className="text-xs text-blue-600 font-medium flex items-center">
                                                    <Brain className="h-3 w-3 mr-1" />
                                                    Match Score
                                                  </span>
                                                  <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 text-xs">
                                                    {Math.floor(Math.random() * 30) + 70}%
                                                  </Badge>
                                                </div>
                                              </div>
                                            )}
                                            
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      {/* Candidate Detail Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Candidate Details</DrawerTitle>
            <DrawerDescription>View and manage candidate information</DrawerDescription>
          </DrawerHeader>
          {selectedCandidate && (
            <div className="px-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedCandidate.photo} alt={selectedCandidate.name} />
                  <AvatarFallback className="text-xl">
                    {selectedCandidate.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{selectedCandidate.name}</h2>
                  <p className="text-muted-foreground">
                    {jobs.find(j => j.id === selectedCandidate.jobId)?.title || "Unknown Position"}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCandidate.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{selectedCandidate.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>{selectedCandidate.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>{selectedCandidate.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Applied Date</p>
                  <p>{selectedCandidate.appliedDate}</p>
                </div>
              </div>
              
              {showAIFeatures && (
                <div className="mb-6">
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md flex items-center text-blue-700">
                        <Brain className="h-4 w-4 mr-2" />
                        AI Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-blue-800">Job Match</span>
                            <span className="text-sm font-medium text-blue-800">{selectedCandidate.aiScore || 85}%</span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${selectedCandidate.aiScore || 85}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-blue-800">Culture Fit</span>
                            <span className="text-sm font-medium text-blue-800">{selectedCandidate.fitPercentage || 75}%</span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${selectedCandidate.fitPercentage || 75}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-md p-3 border border-blue-200">
                          <h4 className="text-sm font-medium text-blue-800 mb-2">AI Recommendations</h4>
                          <ul className="space-y-2 text-sm text-blue-700">
                            <li className="flex items-start">
                              <span className="h-4 w-4 text-blue-500 mr-2">•</span>
                              <span>Focus interview on project management experience</span>
                            </li>
                            <li className="flex items-start">
                              <span className="h-4 w-4 text-blue-500 mr-2">•</span>
                              <span>Ask about experience with remote team coordination</span>
                            </li>
                            <li className="flex items-start">
                              <span className="h-4 w-4 text-blue-500 mr-2">•</span>
                              <span>Verify proficiency in mentioned technical skills</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Resume Highlights</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>5+ years experience in software development</li>
                    <li>Led team of 3 developers on project XYZ</li>
                    <li>Increased deployment efficiency by 30%</li>
                    <li>Proficient in React, TypeScript, and Node.js</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Interview Notes</h3>
                  <p className="text-muted-foreground italic">
                    {showAIFeatures ? "AI-summarized notes: Strong technical skills, good communication, but limited experience with our specific tech stack. Recommended for technical assessment." : "No interview notes yet."}
                  </p>
                </div>
              </div>
              
              {showAIFeatures && (
                <div className="mb-6 p-4 bg-gray-50 rounded-md border">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium">AI Assistant</h3>
                  </div>
                  <div className="bg-white p-3 rounded-md border mb-3">
                    <p className="text-sm italic text-gray-600">
                      Ask me anything about this candidate or for suggestions...
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs">Generate interview questions</Button>
                    <Button variant="outline" size="sm" className="text-xs">Compare with other candidates</Button>
                  </div>
                </div>
              )}
            </div>
          )}
          <DrawerFooter>
            <div className="flex justify-between">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Resume
              </Button>
              <div className="flex gap-2">
                <Button variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
                <Button>Schedule Interview</Button>
              </div>
            </div>
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
