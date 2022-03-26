package com.polling.repository.candidate;

import com.polling.entity.candidate.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    Optional<Candidate> findByName(String name);
}