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
      description: `"${newStageName}" has been added to your workflow.",
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
    const candidate = candidates.find((c) => c.id === candidateId);
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
      {/* ... rest of component JSX remains unchanged */}
    </div>
  );
};

export default Workflow;
