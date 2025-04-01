import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, Mail, Phone, FileText } from "lucide-react";
import { candidates, jobs, applicationStages, users } from "@/data/mockData";

const Candidates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [showFilters, setShowFilters] = useState(false);
  const [showCandidateProfile, setShowCandidateProfile] = useState<number | null>(null);

  const allTags = Array.from(
    new Set(candidates.flatMap((candidate) => candidate.tags))
  );

  const filteredCandidates = candidates.filter((candidate) => {
    let matches = candidate.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (jobFilter && candidate.jobId.toString() !== jobFilter) {
      matches = false;
    }
    
    if (stageFilter && candidate.status.id.toString() !== stageFilter) {
      matches = false;
    }
    
    if (tagFilter && !candidate.tags.includes(tagFilter)) {
      matches = false;
    }
    
    return matches;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setJobFilter("");
    setStageFilter("");
    setTagFilter("");
  };

  const handleCandidateClick = (candidateId: number) => {
    setShowCandidateProfile(candidateId);
  };

  const selectedCandidate = candidates.find(
    (candidate) => candidate.id === showCandidateProfile
  );

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Candidates</h1>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="card" onValueChange={(v) => setViewMode(v as "card" | "table")}>
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="card">Card View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
              {(jobFilter || stageFilter || tagFilter) && (
                <Badge className="ml-1 bg-primary hover:bg-primary-700">
                  {(jobFilter ? 1 : 0) + (stageFilter ? 1 : 0) + (tagFilter ? 1 : 0)}
                </Badge>
              )}
            </Button>
            
            {(jobFilter || stageFilter || tagFilter) && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Clear Filters
              </Button>
            )}
          </div>
          
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Job</label>
                <Select value={jobFilter} onValueChange={setJobFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Jobs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Jobs</SelectItem>
                    {jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id.toString()}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Stage</label>
                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Stages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Stages</SelectItem>
                    {applicationStages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id.toString()}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tag</label>
                <Select value={tagFilter} onValueChange={setTagFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Tags</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => {
            const jobTitle = jobs.find((job) => job.id === candidate.jobId)?.title || "Unknown Job";
            
            return (
              <Card 
                key={candidate.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCandidateClick(candidate.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={candidate.photo} alt={candidate.name} />
                        <AvatarFallback>{candidate.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{candidate.name}</CardTitle>
                        <CardDescription className="truncate max-w-[230px]">
                          {jobTitle}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={candidate.status.color}>
                      {candidate.status.name}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{candidate.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{candidate.phone}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {candidate.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <div className="text-xs text-muted-foreground">
                    Applied: {candidate.appliedDate}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
          
          {filteredCandidates.length === 0 && (
            <div className="col-span-full text-center p-8 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">No candidates found matching your filters.</p>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Applied For</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Tags</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.length > 0 ? (
                    filteredCandidates.map((candidate) => {
                      const jobTitle = jobs.find((job) => job.id === candidate.jobId)?.title || "Unknown Job";
                      
                      return (
                        <TableRow 
                          key={candidate.id} 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleCandidateClick(candidate.id)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={candidate.photo} alt={candidate.name} />
                                <AvatarFallback>{candidate.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{candidate.name}</p>
                                <p className="text-sm text-muted-foreground">{candidate.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{jobTitle}</TableCell>
                          <TableCell>
                            <Badge className={candidate.status.color}>
                              {candidate.status.name}
                            </Badge>
                          </TableCell>
                          <TableCell>{candidate.appliedDate}</TableCell>
                          <TableCell>{candidate.location}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {candidate.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No candidates found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      
      {selectedCandidate && (
        <Dialog open={!!showCandidateProfile} onOpenChange={(open) => !open && setShowCandidateProfile(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Candidate Profile</DialogTitle>
              <DialogDescription>
                View and manage candidate information
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-center mb-4">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={selectedCandidate.photo} alt={selectedCandidate.name} />
                    <AvatarFallback className="text-lg">{selectedCandidate.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold mt-2">{selectedCandidate.name}</h2>
                  <p className="text-muted-foreground">{selectedCandidate.location}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedCandidate.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedCandidate.phone}</span>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm font-medium mb-1">Applied For</p>
                    <p>{jobs.find(job => job.id === selectedCandidate.jobId)?.title}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Status</p>
                    <Badge className={selectedCandidate.status.color}>
                      {selectedCandidate.status.name}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Applied Date</p>
                    <p className="text-sm">{selectedCandidate.appliedDate}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedCandidate.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button className="w-full">
                    <Mail className="mr-2 h-4 w-4" /> Send Message
                  </Button>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Tabs defaultValue="resume">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="resume">Resume</TabsTrigger>
                    <TabsTrigger value="interviews">Interviews</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="resume">
                    <div className="bg-gray-50 p-6 rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Resume</h3>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" /> Download
                        </Button>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="font-medium mb-2">Summary</h3>
                        <p className="text-sm text-muted-foreground">{selectedCandidate.resume.summary}</p>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="font-medium mb-2">Experience</h3>
                        <div className="space-y-4">
                          {selectedCandidate.resume.experience.map((exp, index) => (
                            <div key={index} className="border-b pb-3 last:border-0">
                              <div className="flex justify-between mb-1">
                                <h4 className="font-medium">{exp.position}</h4>
                                <span className="text-sm text-muted-foreground">{exp.duration}</span>
                              </div>
                              <p className="text-sm mb-1">{exp.company}</p>
                              <p className="text-sm text-muted-foreground">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="font-medium mb-2">Education</h3>
                        <div className="space-y-4">
                          {selectedCandidate.resume.education.map((edu, index) => (
                            <div key={index}>
                              <div className="flex justify-between">
                                <h4 className="font-medium">{edu.degree}</h4>
                                <span className="text-sm text-muted-foreground">{edu.year}</span>
                              </div>
                              <p className="text-sm">{edu.institution}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-1">
                          {selectedCandidate.resume.skills.map((skill, index) => (
                            <Badge key={index} variant="outline">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="interviews">
                    <div className="bg-gray-50 p-6 rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Scheduled Interviews</h3>
                        <Button variant="outline" size="sm">Schedule Interview</Button>
                      </div>
                      
                      {selectedCandidate.interviews.length > 0 ? (
                        <div className="space-y-4">
                          {selectedCandidate.interviews.map((interview) => (
                            <div key={interview.id} className="p-4 border rounded-lg bg-white">
                              <div className="flex justify-between mb-2">
                                <h4 className="font-medium">{interview.type}</h4>
                                <Badge variant="outline">{interview.date}</Badge>
                              </div>
                              <p className="text-sm mb-2">Time: {interview.time}</p>
                              <div>
                                <p className="text-sm font-medium mb-1">Interviewers:</p>
                                <div className="flex space-x-2">
                                  {interview.interviewers.map((interviewer) => (
                                    <Avatar key={interviewer.id} className="h-8 w-8">
                                      <AvatarImage src={interviewer.avatar} alt={interviewer.name} />
                                      <AvatarFallback>{interviewer.name.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          No interviews scheduled yet.
                        </p>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notes">
                    <div className="bg-gray-50 p-6 rounded-lg border">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Notes & Feedback</h3>
                        <Button variant="outline" size="sm">Add Note</Button>
                      </div>
                      
                      {selectedCandidate.notes.length > 0 ? (
                        <div className="space-y-4">
                          {selectedCandidate.notes.map((note, index) => (
                            <div key={index} className="p-4 border rounded-lg bg-white">
                              <div className="flex items-center gap-2 mb-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={note.user.avatar} alt={note.user.name} />
                                  <AvatarFallback>{note.user.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{note.user.name}</span>
                                <span className="text-xs text-muted-foreground">{note.date}</span>
                              </div>
                              <p className="text-sm">{note.content}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          No notes have been added yet.
                        </p>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="activity">
                    <div className="bg-gray-50 p-6 rounded-lg border">
                      <h3 className="font-medium mb-4">Activity Log</h3>
                      
                      <div className="space-y-4">
                        <div className="border-l-2 border-blue-500 pl-4 pb-4">
                          <p className="text-sm text-muted-foreground mb-1">Today</p>
                          <p className="text-sm">Application viewed by {users[0].name}</p>
                        </div>
                        
                        <div className="border-l-2 border-purple-500 pl-4 pb-4">
                          <p className="text-sm text-muted-foreground mb-1">{selectedCandidate.appliedDate}</p>
                          <p className="text-sm">Application submitted for {jobs.find(job => job.id === selectedCandidate.jobId)?.title}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Candidates;
