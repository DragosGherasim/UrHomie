using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using user_management_microservice.Domain.Entities;
using ServiceProvider = user_management_microservice.Domain.Entities.ServiceProvider;

namespace user_management_microservice.Infrastructure.Persistence.Context;

public partial class UserManagementDbContext : DbContext
{
    public UserManagementDbContext(DbContextOptions<UserManagementDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Client> Clients { get; set; }

    public virtual DbSet<ServiceProvider> ServiceProviders { get; set; }

    public virtual DbSet<UserProfile> UserProfiles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_uca1400_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Client>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("client");

            entity.HasIndex(e => e.UserProfileId, "user_profile_id").IsUnique();

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnType("bigint(20)")
                .HasColumnName("id");
            entity.Property(e => e.UserProfileId)
                .HasColumnType("bigint(20)")
                .HasColumnName("user_profile_id");

            entity.HasOne(d => d.UserProfile).WithOne(p => p.Client)
                .HasForeignKey<Client>(d => d.UserProfileId)
                .HasConstraintName("client_ibfk_1");
        });

        modelBuilder.Entity<ServiceProvider>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("service_provider");

            entity.HasIndex(e => e.UserProfileId, "user_profile_id").IsUnique();

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnType("bigint(20)")
                .HasColumnName("id");
            entity.Property(e => e.Certifications)
                .HasMaxLength(255)
                .HasColumnName("certifications");
            entity.Property(e => e.CoverageArea)
                .HasColumnType("tinyint(4)")
                .HasColumnName("coverage_area");
            entity.Property(e => e.Education)
                .HasMaxLength(255)
                .HasColumnName("education");
            entity.Property(e => e.ExperienceDescriptions)
                .HasColumnType("text")
                .HasColumnName("experience_descriptions");
            entity.Property(e => e.UserProfileId)
                .HasColumnType("bigint(20)")
                .HasColumnName("user_profile_id");
            entity.Property(e => e.WorkSchedule)
                .HasMaxLength(255)
                .HasColumnName("work_schedule");

            entity.HasOne(d => d.UserProfile).WithOne(p => p.ServiceProvider)
                .HasForeignKey<ServiceProvider>(d => d.UserProfileId)
                .HasConstraintName("service_provider_ibfk_1");
        });

        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("user_profile");

            entity.HasIndex(e => e.Email, "email").IsUnique();

            entity.HasIndex(e => e.PhoneNumber, "phone_number").IsUnique();

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnType("bigint(20)")
                .HasColumnName("id");
            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .HasColumnName("address");
            entity.Property(e => e.City)
                .HasMaxLength(64)
                .HasColumnName("city");
            entity.Property(e => e.Country)
                .HasMaxLength(64)
                .HasColumnName("country");
            entity.Property(e => e.Email)
                .HasMaxLength(125)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(64)
                .HasColumnName("first_name");
            entity.Property(e => e.LastName)
                .HasMaxLength(32)
                .HasColumnName("last_name");
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(20)
                .HasColumnName("phone_number");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
