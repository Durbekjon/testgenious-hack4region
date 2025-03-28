"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Twitter, Linkedin, Globe } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

type TeamMember = {
  name: string
  role: string
  bio: string
  image: string
  social: {
    twitter?: string
    linkedin?: string
    website?: string
  }
}

const teamMembers: TeamMember[] = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    bio: "Former EdTech executive with 15+ years experience. Passionate about using AI to revolutionize education.",
    image: "/placeholder.svg?height=400&width=400",
    social: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
      website: "https://example.com",
    },
  },
  {
    name: "Michael Chen",
    role: "CTO",
    bio: "AI researcher with a PhD from MIT. Led development teams at Google before joining TestGenius.",
    image: "/placeholder.svg?height=400&width=400",
    social: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    name: "Aisha Patel",
    role: "Head of Product",
    bio: "Former teacher turned product manager. Combines classroom experience with deep product expertise.",
    image: "/placeholder.svg?height=400&width=400",
    social: {
      linkedin: "https://linkedin.com",
      website: "https://example.com",
    },
  },
]

export function TeamSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
      },
    },
  }

  return (
    <div className="container">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our diverse team of experts is committed to creating the best test generation platform for educators and
          organizations.
        </p>
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
      >
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border group"
          >
            <div className="relative overflow-hidden">
              <div className="aspect-square bg-muted">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage
                    src={member.image}
                    alt={member.name}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <AvatarFallback className="text-2xl w-full h-full rounded-none">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <motion.div
                className="absolute inset-0 bg-primary/80 flex items-center justify-center p-6 flex-col text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <p className="text-center line-clamp-6">{member.bio}</p>
                <div className="flex gap-4 mt-4">
                  {member.social.twitter && (
                    <Button size="icon" variant="ghost" className="rounded-full bg-white/20 hover:bg-white/30" asChild>
                      <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-5 w-5" />
                        <span className="sr-only">Twitter</span>
                      </a>
                    </Button>
                  )}
                  {member.social.linkedin && (
                    <Button size="icon" variant="ghost" className="rounded-full bg-white/20 hover:bg-white/30" asChild>
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-5 w-5" />
                        <span className="sr-only">LinkedIn</span>
                      </a>
                    </Button>
                  )}
                  {member.social.website && (
                    <Button size="icon" variant="ghost" className="rounded-full bg-white/20 hover:bg-white/30" asChild>
                      <a href={member.social.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-5 w-5" />
                        <span className="sr-only">Website</span>
                      </a>
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

